// Constants and Configurations
const STORAGE_KEY = 'user_preferences';
const DEFAULT_TAB_URL = 'https://www.example.com';
const DEFAULT_SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes in milliseconds
const ALARM_NAME = 'periodicReminder';
const DEFAULT_USER_PREFERENCES = { startTime: Date.now(), tabUrl: DEFAULT_TAB_URL };

// Utility Function for Logging with Different Levels
const log = (level, message, error = null) => {
  const timestamp = new Date().toISOString();
  const errorDetails = error ? `Error Details: ${JSON.stringify(error)}` : '';
  console[level](`[${timestamp}] ${message} ${errorDetails}`);
};

// Helper Functions for Handling Storage Operations
const storage = {
  async get() {
    try {
      return await new Promise((resolve, reject) => {
        chrome.storage.local.get([STORAGE_KEY], (result) => {
          if (chrome.runtime.lastError) {
            return reject(new Error('Failed to retrieve user preferences.'));
          }
          resolve(result[STORAGE_KEY] || null);
        });
      });
    } catch (error) {
      log('error', 'Error fetching data from storage', error);
      throw error;
    }
  },

  async set(data) {
    try {
      await new Promise((resolve, reject) => {
        chrome.storage.local.set({ [STORAGE_KEY]: data }, () => {
          if (chrome.runtime.lastError) {
            return reject(new Error('Failed to save user preferences.'));
          }
          resolve();
        });
      });
      log('info', 'User preferences saved to storage');
    } catch (error) {
      log('error', 'Error saving data to storage', error);
      throw error;
    }
  },

  async remove() {
    try {
      await new Promise((resolve, reject) => {
        chrome.storage.local.remove([STORAGE_KEY], () => {
          if (chrome.runtime.lastError) {
            return reject(new Error('Failed to clear data from storage.'));
          }
          resolve();
        });
      });
      log('info', 'User preferences cleared from storage');
    } catch (error) {
      log('error', 'Error clearing data from storage', error);
      throw error;
    }
  }
};

// Function to Initialize User Preferences with Default Settings
const initializeUserPreferences = async () => {
  try {
    const existingPreferences = await storage.get();
    if (!existingPreferences) {
      await storage.set(DEFAULT_USER_PREFERENCES);
      log('info', 'User preferences initialized with default values');
    }
  } catch (error) {
    log('error', 'Failed to initialize user preferences', error);
  }
};

// Function to Open the User-Defined URL in a New Tab
const openUserTab = async () => {
  try {
    const preferences = await storage.get();
    const url = preferences?.tabUrl || DEFAULT_TAB_URL;
    await chrome.tabs.create({ url });
    log('info', `Opened new tab with URL: ${url}`);
  } catch (error) {
    log('error', 'Failed to open user tab', error);
  }
};

// Periodic Sync Task to Update Preferences or Perform Maintenance
const startPeriodicSync = () => {
  setInterval(async () => {
    try {
      const preferences = await storage.get();
      if (preferences) {
        await storage.set({ ...preferences, lastSync: Date.now() });
        log('info', 'Preferences synchronized');
      }
    } catch (error) {
      log('error', 'Error during periodic sync', error);
    }
  }, DEFAULT_SYNC_INTERVAL_MS);
};

// Initialize Application on Extension Install or Update
chrome.runtime.onInstalled.addListener(async () => {
  log('info', 'Extension installed or updated');
  await initializeUserPreferences();
  startPeriodicSync();
});

// Listen for Click on Browser Action (Extension Icon)
chrome.browserAction.onClicked.addListener(openUserTab);

// Handle Tab Update Events (Page Load, URL Change)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    try {
      const preferences = await storage.get();
      if (preferences && tab.url !== preferences.tabUrl) {
        log('info', `Tab ${tabId} URL changed to: ${tab.url}`);
      }
    } catch (error) {
      log('error', 'Error during tab update event', error);
    }
  }
});

// Message Listener to Handle Various Commands (e.g., Set, Get, Clear Preferences)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const handleResponse = (status, data = null) => sendResponse({ status, data });

  const processAction = async (action) => {
    try {
      switch (action.type) {
        case 'setUserPreferences':
          await storage.set(action.preferences);
          handleResponse('success');
          break;

        case 'getUserPreferences':
          const preferences = await storage.get();
          handleResponse('success', preferences);
          break;

        case 'clearPreferences':
          await storage.remove();
          handleResponse('success');
          break;

        default:
          handleResponse('error', 'Invalid action type');
      }
    } catch (error) {
      log('error', 'Error processing message action', error);
      handleResponse('error', error.message);
    }
  };

  processAction(message);
  return true; // Indicates asynchronous response
});

// Create a Periodic Reminder Alarm to Trigger Every 5 Minutes
chrome.alarms.create(ALARM_NAME, {
  delayInMinutes: 5,
  periodInMinutes: 5
});

// Alarm Listener to Handle Background Tasks (e.g., Sync or Notifications)
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_NAME) {
    try {
      const preferences = await storage.get();
      if (preferences) {
        log('info', `Periodic reminder triggered. Current preferences:`, preferences);
        // Additional background tasks, e.g., sending notifications, data sync
      }
    } catch (error) {
      log('error', 'Error during periodic reminder processing', error);
    }
  }
});

// Event for Handling User Interactions (complex logic like validating user input, etc.)
const handleUserInteraction = async () => {
  try {
    // Complex logic, API calls, validation, etc.
    log('info', 'User interaction handled successfully');
  } catch (error) {
    log('error', 'Error handling user interaction', error);
  }
};

// Ensure Everything is Set Up Before the Application is Fully Initialized
const initializeApp = async () => {
  try {
    await initializeUserPreferences();
    log('info', 'Application successfully initialized');
  } catch (error) {
    log('error', 'Error during application initialization', error);
  }
};

// Initialize App on Startup
initializeApp();
