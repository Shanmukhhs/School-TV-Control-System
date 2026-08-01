const noticeBox = document.getElementById("notice-box");
const sendBtn = document.getElementById("send-btn");
const statusLabel = document.getElementById("status-label");
const lastSentLabel = document.getElementById("last-sent-label");

function setStatus(text, type) {
  statusLabel.textContent = `Status: ${text}`;
  statusLabel.className = "status" + (type ? ` ${type}` : "");
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
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
    const body = new URLSearchParams({ notice });
    const apiKeyMeta = document.querySelector('meta[name="api-key"]');
    const apiKey = apiKeyMeta ? apiKeyMeta.content : "";
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

    const response = await fetch("/update_notice", {
      method: "POST",
      headers,
      body,
    });

    const responseText = await response.text();

    if (response.ok && responseText === "Success") {
      setStatus("Notice sent successfully!", "success");
      lastSentLabel.textContent = `Last Sent: ${formatTime(new Date())}`;
      noticeBox.value = "";
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
