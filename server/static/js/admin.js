const noticeBox = document.getElementById("notice-box");
const sendBtn = document.getElementById("send-btn");
const statusLabel = document.getElementById("status-label");
const lastSentLabel = document.getElementById("last-sent-label");
const alignmentBox = document.getElementById("alignment-box");
const publishAtBox = document.getElementById("publish-at-box");
const expireAtBox = document.getElementById("expire-at-box");
const scheduleLabel = document.getElementById("schedule-label");

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

async function refreshScheduleLabel() {
  if (!scheduleLabel) return;
  try {
    const res = await fetch("/get_notice?t=" + Date.now(), { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    const publishAt = data.publish_at || "";
    const expireAt = data.expire_at || "";
    const active = data.active !== false;
    if (!publishAt && !expireAt) {
      scheduleLabel.textContent = "Schedule: none";
      return;
    }
    const now = new Date();
    const expireDt = expireAt ? new Date(expireAt) : null;
    const expired = expireDt && !isNaN(expireDt) && now >= expireDt;
    if (!active && expired) {
      scheduleLabel.textContent = `Schedule: expired ${formatSchedule(expireAt)}`;
      return;
    }
    if (!active && publishAt) {
      scheduleLabel.textContent = `Schedule: will publish ${formatSchedule(publishAt)} (not live yet)`;
      return;
    }
    if (active && expireAt) {
      scheduleLabel.textContent = `Schedule: live now, expires ${formatSchedule(expireAt)}`;
      return;
    }
    if (active && publishAt) {
      scheduleLabel.textContent = `Schedule: live now, published ${formatSchedule(publishAt)}`;
      return;
    }
    scheduleLabel.textContent = "Schedule: none";
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
refreshScheduleLabel();
