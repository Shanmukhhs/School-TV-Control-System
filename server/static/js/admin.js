const noticeBox = document.getElementById("notice-box");
const sendBtn = document.getElementById("send-btn");
const statusLabel = document.getElementById("status-label");
const lastSentLabel = document.getElementById("last-sent-label");
const alignmentBox = document.getElementById("alignment-box");
const publishAtBox = document.getElementById("publish-at-box");
const expireAtBox = document.getElementById("expire-at-box");
const scheduleLabel = document.getElementById("schedule-label");
const pendingLabel = document.getElementById("pending-label");
const cancelScheduledBtn = document.getElementById("cancel-scheduled-btn");

function setStatus(text, type) {
  statusLabel.textContent = `Status: ${text}`;
  statusLabel.className = "status" + (type ? ` ${type}` : "");
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatSchedule(value) {
  if (!value) return "";
  const parts = String(value).split("T");
  if (parts.length !== 2) return String(value);
  const dateParts = parts[0].split("-");
  if (dateParts.length !== 3) return String(value);
  return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${parts[1]}`;
}

async function refreshPendingLabel(data) {
  if (!pendingLabel || !cancelScheduledBtn) return data;
  try {
    let payload = data;
    if (!payload) {
      const res = await fetch("/get_notice?t=" + Date.now(), { cache: "no-store" });
      if (!res.ok) return payload;
      payload = await res.json();
    }
    const pendingPublishAt = payload.pending_publish_at || "";
    if (!pendingPublishAt) {
      pendingLabel.hidden = true;
      pendingLabel.textContent = "";
      cancelScheduledBtn.hidden = true;
      return payload;
    }
    const pendingImage = payload.pending_image || "";
    const pendingNotice = (payload.pending_notice || "").trim();
    const preview = pendingImage ? "poster" : pendingNotice.slice(0, 30);
    pendingLabel.textContent = `Next up: ${preview} at ${formatSchedule(pendingPublishAt)}`;
    pendingLabel.hidden = false;
    cancelScheduledBtn.hidden = false;
    return payload;
  } catch (e) { /* keep previous label */ }
  return data;
}

async function cancelScheduled() {
  if (!cancelScheduledBtn) return;
  cancelScheduledBtn.disabled = true;
  try {
    const response = await fetch("/cancel_scheduled", { method: "POST" });
    const result = await response.text();
    if (response.ok && result === "Success") {
      setStatus("Scheduled content cancelled.", "success");
    } else {
      setStatus(result || "Cancel failed.", "error");
    }
  } catch (error) {
    setStatus(String(error), "error");
  } finally {
    cancelScheduledBtn.disabled = false;
    refreshScheduleLabel();
    refreshPendingLabel();
  }
}

async function refreshScheduleLabel() {
  if (!scheduleLabel) {
    refreshPendingLabel();
    return;
  }
  try {
    const res = await fetch("/get_notice?t=" + Date.now(), { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    const publishAt = data.publish_at || "";
    const expireAt = data.expire_at || "";
    const active = data.active !== false;
    if (!publishAt && !expireAt) {
      scheduleLabel.textContent = "Schedule: none";
      refreshPendingLabel(data);
      return;
    }
    const now = new Date();
    const expireDt = expireAt ? new Date(expireAt) : null;
    const expired = expireDt && !isNaN(expireDt) && now >= expireDt;
    if (!active && expired) {
      scheduleLabel.textContent = `Schedule: expired ${formatSchedule(expireAt)}`;
    } else if (!active && publishAt) {
      scheduleLabel.textContent = `Schedule: will publish ${formatSchedule(publishAt)} (not live yet)`;
    } else if (active && expireAt) {
      scheduleLabel.textContent = `Schedule: live now, expires ${formatSchedule(expireAt)}`;
    } else if (active && publishAt) {
      scheduleLabel.textContent = `Schedule: live now, published ${formatSchedule(publishAt)}`;
    } else {
      scheduleLabel.textContent = "Schedule: none";
    }
    refreshPendingLabel(data);
  } catch (e) { /* keep previous label */ }
}

async function sendNotice() {
  const notice = noticeBox.value.trim();

  if (notice === "") {
    setStatus("Notice cannot be empty.", "error");
    return;
  }

  sendBtn.disabled = true;
  setStatus("Sending...");

  try {
    const alignment = alignmentBox ? alignmentBox.value : "center";
    const publish_at = publishAtBox ? publishAtBox.value : "";
    const expire_at = expireAtBox ? expireAtBox.value : "";
    const body = new URLSearchParams({ notice, alignment, publish_at, expire_at });
    const response = await fetch("/update_notice", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const responseText = await response.text();

    if (response.ok && responseText === "Success") {
      setStatus("Notice sent successfully!", "success");
      lastSentLabel.textContent = `Last Sent: ${formatTime(new Date())}`;
      noticeBox.value = "";
      if (publishAtBox) publishAtBox.value = "";
      if (expireAtBox) expireAtBox.value = "";
      refreshScheduleLabel();
      refreshPendingLabel();
    } else {
      setStatus(responseText || "Server returned an error.", "error");
    }
  } catch (error) {
    setStatus(String(error), "error");
  } finally {
    sendBtn.disabled = false;
  }
}

sendBtn.addEventListener("click", sendNotice);
if (cancelScheduledBtn) cancelScheduledBtn.addEventListener("click", cancelScheduled);
window.refreshScheduleLabel = refreshScheduleLabel;
window.refreshPendingLabel = refreshPendingLabel;
refreshScheduleLabel();
refreshPendingLabel();
