const noticeEl = document.getElementById("notice-text");
noticeEl.style.whiteSpace = "pre-wrap";
const connectionEl = document.getElementById("connection-status");
const lastUpdatedEl = document.getElementById("last-updated");
const logoEl = document.getElementById("logo");
const imageEl = document.getElementById("notice-image");

const POLL_INTERVAL_MS = 5000;
let previousNotice = "";
let previousTimestamp = "";
let previousImage = "";
let previousRev = "";

function loadCachedNotice() {
    const cached = localStorage.getItem("cached_notice");
    const cachedTime = localStorage.getItem("cached_time");
    if (cached && cached !== "") {
        noticeEl.textContent = cached;
        applyNoticeSize(cached);
        previousNotice = cached;
        if (cachedTime) {
            lastUpdatedEl.textContent = "Last Updated: " + cachedTime + " (cached)";
            previousTimestamp = cachedTime;
        }
        return true;
    }
    return false;
}

function saveToCache(noticeText, timestamp) {
    localStorage.setItem("cached_notice", noticeText);
    localStorage.setItem("cached_time", timestamp);
}

function setConnected(online) {
    if (online) {
        connectionEl.textContent = "🟢 Connected";
        connectionEl.className = "connected";
    } else {
        connectionEl.textContent = "🔴 Offline (showing cached notice)";
        connectionEl.className = "offline";
    }
}

function updateImage(imageName) {
    if (imageName) {
        imageEl.src = "/uploads/" + imageName + "?t=" + Date.now();
        imageEl.style.display = "block";
        noticeEl.style.display = "none";
    } else {
        imageEl.style.display = "none";
        imageEl.removeAttribute("src");
        noticeEl.style.display = "";
    }
}

function applyNoticeSize(text) {
    noticeEl.classList.remove("size-lg", "size-md", "size-sm");
    const lines = text.split("\n").length;
    const longestLine = Math.max(...text.split("\n").map(line => line.length));
    noticeEl.style.textAlign = lines > 1 ? "left" : "center";
    if (lines <= 2 && longestLine < 20) {
        noticeEl.classList.add("size-lg");
    } else if (lines <= 4 && longestLine < 40) {
        noticeEl.classList.add("size-md");
    } else {
        noticeEl.classList.add("size-sm");
    }
}

async function checkForUpdates() {
    try {
        const cacheBuster = "?t=" + Date.now();
        const response = await fetch("/get_notice" + cacheBuster, {
            cache: "no-store"
        });
        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }
        const data = await response.json();
        const currentNotice = data.notice || "";
        const serverTimestamp = data.updated_at || "";
        const imageName = data.image || "";
        const serverRev = String(data.rev || "");

        setConnected(true);

        if (imageName !== previousImage || serverRev !== previousRev) {
            updateImage(imageName);
            previousImage = imageName;
        }

        if (currentNotice !== previousNotice || serverRev !== previousRev) {
            if (currentNotice === "") {
                noticeEl.textContent = "No Notice Available";
                noticeEl.classList.remove("size-lg", "size-md", "size-sm");
                lastUpdatedEl.textContent = "Last Updated: Never";
                localStorage.removeItem("cached_notice");
                localStorage.removeItem("cached_time");
            } else {
                noticeEl.textContent = currentNotice;
                applyNoticeSize(currentNotice);
                if (serverTimestamp) {
                    lastUpdatedEl.textContent = "Last Updated: " + serverTimestamp;
                } else {
                    lastUpdatedEl.textContent = "Last Updated: Unknown";
                }
                saveToCache(currentNotice, serverTimestamp);
            }
            previousNotice = currentNotice;
            previousTimestamp = serverTimestamp;
            previousRev = serverRev;
        }
    } catch (error) {
        setConnected(false);
    }
    setTimeout(checkForUpdates, POLL_INTERVAL_MS);
}

logoEl.addEventListener("error", () => {
    logoEl.style.display = "none";
});

loadCachedNotice();
checkForUpdates();
