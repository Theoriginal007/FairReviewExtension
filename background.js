// Constants and Configurations
const STORAGE_KEY = 'user_preferences';
const DEFAULT_TAB = 'https://www.example.com';
const INTERVAL_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
const ALARM_NAME = 'periodicReminder';

// Utility functions
/**
 * Asynchronously handles Chrome storage operations: get, set, remove.
 * @param {string} action The storage action to perform ('get', 'set', 'remove').
 * @param {object} [data] Data to store (only for 'set' action).
 * @returns {Promise} Resolves with data for 'get', or void for 'set' and 'remove'.
 */
const storageHandler = (action, data = null) => {
  return new Promise((resolve, reject) => {
    switch (action) {
      case 'get':
        chrome.storage.local.get([STORAGE_KEY], (result) => {
          if (chrome.runtime.lastError) {
            reject(new Error('Error retrieving data'));
          } else {
            resolve(result[STORAGE_KEY] || null);
          }
        });
        break;
      case 'set':
        chrome.storage.local.set({ [STORAGE_KEY]: data }, () => {
          if (chrome.runtime.lastError) {
            reject(new Error('Error saving data'));
          } else {
            resolve();
          }
        });
        break;
      case 'remove':
        chrome.storage.local.remove([STORAGE_KEY], () => {
          if (chrome.runtime.lastError) {
            reject(new Error('Error clearing data'));
          } else {
            resolve();
          }
        });
        break;
      default:
        reject(new Error('Invalid storage action'));
    }
  });
};

/**
 * Initializes default preferences if not already set.
 * @returns {Promise<void>}
 */
const initializeUserPreferences = async () => {
  try {
    const existingPreferences = await storageHandler('get');
    if (!existingPreferences) {
      const defaultPreferences = {
        startTime: Date.now(),
        tabUrl: DEFAULT_TAB,
      };
      await storageHandler('set', defaultPreferences);
      console.log('User preferences initialized with default values.');
    }
  } catch (error) {
    console.error('Error initializing user preferences: ', error.message);
  }
};

/**
 * Handles actions upon browser action click (extension button click).
 * Opens a new tab with the user-defined or default URL.
 */
const handleBrowserActionClick = async () => {
  try {
    await initializeUserPreferences();
    const userPreferences = await storageHandler('get');
    const currentTabUrl = userPreferences ? userPreferences.tabUrl : DEFAULT_TAB;
    await chrome.tabs.create({ url: currentTabUrl });
  } catch (error) {
    console.error('Error handling browser action click: ', error.message);
  }
};

/**
 * Sets up periodic background sync task for updating preferences or other tasks.
 */
const setupPeriodicSync = () => {
  setInterval(async () => {
    try {
      const userPreferences = await storageHandler('get');
      if (userPreferences) {
        // Simulate background syncing task (updating preferences, sending data to a server)
        console.log('Syncing user preferences: ', userPreferences);
        await storageHandler('set', { ...userPreferences, lastSync: Date.now() });
      }
    } catch (error) {
      console.error('Error during periodic sync: ', error.message);
    }
  }, INTERVAL_TIME);
};

/**
 * Listens for extension installation or updates and sets up necessary tasks.
 */
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed or updated.');
  await initializeUserPreferences(); // Ensure preferences are initialized on install
  setupPeriodicSync(); // Start the periodic sync task
});

/**
 * Listens for the browser action (extension icon click) and opens a new tab.
 */
chrome.browserAction.onClicked.addListener(handleBrowserActionClick);

/**
 * Monitors tab updates (page load, tab switch) and logs URL changes.
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    try {
      const userPreferences = await storageHandler('get');
      if (userPreferences && tab.url !== userPreferences.tabUrl) {
        console.log(`Tab ${tabId} changed URL to: ${tab.url}`);
      }
    } catch (error) {
      console.error('Error during tab update: ', error.message);
    }
  }
});

/**
 * Listens for messages from popup or content scripts.
 * Responds with user preferences or handles user updates.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const handleResponse = (status, data = null) => sendResponse({ status, data });

  switch (message.type) {
    case 'setUserPreferences':
      storageHandler('set', message.preferences)
        .then(() => handleResponse('success'))
        .catch((error) => handleResponse('error', error.message));
      return true; // Asynchronous response

    case 'getUserPreferences':
      storageHandler('get')
        .then((preferences) => handleResponse('success', preferences))
        .catch((error) => handleResponse('error', error.message));
      return true;

    case 'clearPreferences':
      storageHandler('remove')
        .then(() => handleResponse('success'))
        .catch((error) => handleResponse('error', error.message));
      return true;

    default:
      handleResponse('error', 'Unknown message type');
      return false;
  }
});

// Periodic reminder using the Alarms API (every 5 minutes).
chrome.alarms.create(ALARM_NAME, {
  delayInMinutes: 5,  // Trigger after 5 minutes
  periodInMinutes: 5, // Repeat every 5 minutes
});

/**
 * Handles periodic tasks triggered by alarms (e.g., data sync, notifications).
 */
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_NAME) {
    try {
      const userPreferences = await storageHandler('get');
      if (userPreferences) {
        console.log('Periodic reminder triggered. User preferences:', userPreferences);
        // You can add additional background tasks here (e.g., notifications, data sync)
      }
    } catch (error) {
      console.error('Error processing alarm event: ', error.message);
    }
  }
});
