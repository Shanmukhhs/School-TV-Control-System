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
let previousAlignment = "center";

const VALID_ALIGNMENTS = new Set(["left", "center", "right", "justify"]);

function normalizeAlignment(value) {
    const cleaned = (value || "").toLowerCase();
    return VALID_ALIGNMENTS.has(cleaned) ? cleaned : "center";
}

function loadCachedNotice() {
    const cached = localStorage.getItem("cached_notice");
    const cachedTime = localStorage.getItem("cached_time");
    const cachedAlignment = normalizeAlignment(localStorage.getItem("cached_alignment"));
    if (cached && cached !== "") {
        noticeEl.textContent = cached;
        applyNoticeSize(cached, cachedAlignment);
        previousNotice = cached;
        previousAlignment = cachedAlignment;
        if (cachedTime) {
            lastUpdatedEl.textContent = "Last Updated: " + cachedTime + " (cached)";
            previousTimestamp = cachedTime;
        }
        return true;
    }
    return false;
}

function saveToCache(noticeText, timestamp, alignment) {
    localStorage.setItem("cached_notice", noticeText);
    localStorage.setItem("cached_time", timestamp);
    localStorage.setItem("cached_alignment", normalizeAlignment(alignment));
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

function applyNoticeSize(text, alignment) {
    noticeEl.classList.remove("size-lg", "size-md", "size-sm");
    const lines = text.split("\n").length;
    const longestLine = Math.max(...text.split("\n").map(line => line.length));
    // User-chosen alignment applies to text only (images ignore it).
    noticeEl.style.textAlign = normalizeAlignment(alignment);
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
        const serverAlignment = normalizeAlignment(data.alignment);

        setConnected(true);

        if (imageName !== previousImage || serverRev !== previousRev) {
            updateImage(imageName);
            previousImage = imageName;
        }

        if (currentNotice !== previousNotice || serverRev !== previousRev || serverAlignment !== previousAlignment) {
            if (currentNotice === "") {
                noticeEl.textContent = "No Notice Available";
                noticeEl.classList.remove("size-lg", "size-md", "size-sm");
                noticeEl.style.textAlign = "center";
                lastUpdatedEl.textContent = "Last Updated: Never";
                localStorage.removeItem("cached_notice");
                localStorage.removeItem("cached_time");
                localStorage.removeItem("cached_alignment");
            } else {
                noticeEl.textContent = currentNotice;
                applyNoticeSize(currentNotice, serverAlignment);
                if (serverTimestamp) {
                    lastUpdatedEl.textContent = "Last Updated: " + serverTimestamp;
                } else {
                    lastUpdatedEl.textContent = "Last Updated: Unknown";
                }
                saveToCache(currentNotice, serverTimestamp, serverAlignment);
            }
            previousNotice = currentNotice;
            previousTimestamp = serverTimestamp;
            previousRev = serverRev;
            previousAlignment = serverAlignment;
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
