const noticeEl = document.getElementById("notice-text");
const connectionEl = document.getElementById("connection-status");
const lastUpdatedEl = document.getElementById("last-updated");
const logoEl = document.getElementById("logo");

const POLL_INTERVAL_MS = 5000;
let previousNotice = "";
let previousTimestamp = "";

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

async function checkForUpdates() {
    try {
        // Add cache-busting timestamp to URL to prevent lazy caching
        const cacheBuster = "?t=" + Date.now();
        const response = await fetch("/get_notice" + cacheBuster, { 
            cache: "no-store" 
        });
        
        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }
        
        // Read the JSON response from the server
        const data = await response.json();
        const currentNotice = data.notice || "";
        const serverTimestamp = data.updated_at || "";
        
        setConnected(true);
        
        if (currentNotice !== previousNotice || serverTimestamp !== previousTimestamp) {
            if (currentNotice === "") {
                noticeEl.textContent = "No Notice Available";
                noticeEl.classList.remove("size-lg", "size-md", "size-sm");
                lastUpdatedEl.textContent = "Last Updated: Never";
                localStorage.removeItem("cached_notice");
                localStorage.removeItem("cached_time");
            } else {
                noticeEl.textContent = currentNotice;
                applyNoticeSize(currentNotice);
                
                // Use the server's IST timestamp, not the TV's local time
                if (serverTimestamp) {
                    lastUpdatedEl.textContent = "Last Updated: " + serverTimestamp;
                } else {
                    lastUpdatedEl.textContent = "Last Updated: Unknown";
                }
                
                saveToCache(currentNotice, serverTimestamp);
            }
            
            previousNotice = currentNotice;
            previousTimestamp = serverTimestamp;
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