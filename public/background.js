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
      console.log('Notification created with ID:', notificationId);
    },
  );

  chrome.notifications.onClicked.addListener((notificationId) => {
    console.log('Notification clicked:', notificationId);
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
