const updateUserAboutFeaturesByNotification = (notificationId) => {
  chrome.notifications.create(
    'notificationId',
    {
      type: 'basic',
      iconUrl: 'icon128.png',
      title: 'New Features Of My Tube',
      message: 'We have added new features to My Tube. Please check the new features.',
      priority: 2,
    },
    (notificationId) => {
      // console.log('Notification created with ID:', notificationId);
    },
  );

  chrome.notifications.onClicked.addListener((notificationId) => {
    // console.log('Notification clicked:', notificationId);
    chrome.tabs.create({
      url: 'https://medium.com/@suryakantsharma.me/my-tube-extension-f3dcf8a9a70b',
    });
  });
};

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'update') {
    updateUserAboutFeaturesByNotification();
  } else if (details.reason === 'install') {
    updateUserAboutFeaturesByNotification();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'showNotification') {
    updateUserAboutFeaturesByNotification();
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'openPopup') {
    chrome.windows.create({
      url: chrome.runtime.getURL('index.html'),
      type: 'popup',
      width: 300,
      height: 550,
    });
  }
});

//  popup for feedback

function checkFeedbackReminder() {
  chrome.storage.local.get(['lastFeedback'], (result) => {
    const now = Date.now();
    const last = result.lastFeedback || 0;
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    if (now - last > thirtyDays) {
      chrome.storage.local.set({ path: 'feedback-form' });

      setTimeout(() => {
        chrome.windows.create({
          url: chrome.runtime.getURL('index.html'),
          type: 'popup',
          width: 300,
          height: 550,
        });
        chrome.storage.local.set({ lastFeedback: now });
      }, 10000);
    }
  });
}

// ✅ Run when user switches to a tab
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url && tab.url.includes('youtube.com')) {
      checkFeedbackReminder();
    }
  });
});

// ✅ Run when a YouTube tab loads/updates
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete' && tab.url && tab.url.includes('youtube.com')) {
//     checkFeedbackReminder();
//   }
// });

// close popup when requested
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'closeFeedback' && sender.tab) {
    chrome.windows.remove(sender.tab.windowId);
  }
});
