// Background service worker for side panel extension

// Set up side panel behavior when extension toolbar icon is clicked
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error: unknown) => console.error(error));

// Optional: Enable side panel only on specific sites
// chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
//   if (!tab.url) return;
//   const url = new URL(tab.url);
//   
//   // Enable side panel on all sites for now
//   chrome.sidePanel.setOptions({
//     tabId,
//     path: 'public/sidepanel.html',
//     enabled: true
//   });
// });

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Sales Assistant Extension installed');
});