let activeTabId = null;
let startTime = Date.now();

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (currentTab) {
    const endTime = Date.now();
    const timeSpent = Math.round((endTime - startTime) / 1000); // in seconds

    chrome.tabs.get(currentTab, (tab) => {
      if (tab && tab.url && tab.url.startsWith("http")) {
        const site = new URL(tab.url).hostname;

        fetch("http://localhost:5000/api/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ site, timeSpent })
        }).catch((err) => console.error("Logging error:", err));
      }
    });
  }
currentTab = activeInfo.tabId;
  startTime = Date.now();
});

chrome.tabs.onRemoved.addListener(() => {
  currentTab = null;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'complete') {
    if (activeTabId !== null) {
      logTime(activeTabId);
    }
    activeTabId = tabId;
    startTime = Date.now();
  }
});

function logTime(tabId) {
  const timeSpent = Date.now() - startTime;
  chrome.tabs.get(tabId, (tab) => {
    if (tab.url.startsWith("http")) {
      const payload = {
        url: tab.url,
        timeSpent,
        timestamp: new Date().toISOString()
      };

      fetch('http://localhost:3002/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.error("Logging error:", err));
    }
  });
}