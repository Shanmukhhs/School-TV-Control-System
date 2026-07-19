const noticeEl = document.getElementById("notice-text");
const connectionEl = document.getElementById("connection-status");
const lastUpdatedEl = document.getElementById("last-updated");
const logoEl = document.getElementById("logo");

const POLL_INTERVAL_MS = 5000;
let previousNotice = "";

function setConnected(online) {
  if (online) {
    connectionEl.textContent = "🟢 Connected";
    connectionEl.className = "connected";
  } else {
    connectionEl.textContent = "🔴 Offline";
    connectionEl.className = "offline";
  }
}

function applyNoticeSize(text) {
  noticeEl.classList.remove("size-lg", "size-md", "size-sm");

  if (text.length < 40) {
    noticeEl.classList.add("size-lg");
  } else if (text.length < 120) {
    noticeEl.classList.add("size-md");
  } else {
    noticeEl.classList.add("size-sm");
  }
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

async function checkForUpdates() {
  try {
    const response = await fetch("/get_notice", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const currentNotice = (await response.text()).trim();
    setConnected(true);

    if (currentNotice !== previousNotice) {
      if (currentNotice === "") {
        noticeEl.textContent = "No Notice Available";
        noticeEl.classList.remove("size-lg", "size-md", "size-sm");
      } else {
        noticeEl.textContent = currentNotice;
        applyNoticeSize(currentNotice);
      }

      lastUpdatedEl.textContent = `Last Updated: ${formatTime(new Date())}`;
      previousNotice = currentNotice;
    }
  } catch (error) {
    setConnected(false);
  }

  setTimeout(checkForUpdates, POLL_INTERVAL_MS);
}

logoEl.addEventListener("error", () => {
  logoEl.style.display = "none";
});

checkForUpdates();
