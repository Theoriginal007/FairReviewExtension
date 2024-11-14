// Log a message to indicate the content script has been injected
console.log("User Preferences Extension content script loaded");

// Function to send a message to the background script
const sendMessageToBackground = (message) => {
  chrome.runtime.sendMessage(message, (response) => {
    if (response && response.status === 'success') {
      console.log('Message sent to background: ', message);
    } else {
      console.error('Error sending message to background');
    }
  });
};

// Example: Change the background color of the webpage
const changeBackgroundColor = () => {
  document.body.style.backgroundColor = '#f0f0f0'; // Change to light gray
};

// Check if the user has preferences saved, and perform actions accordingly
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'setUserPreferences') {
    // Handle setting user preferences from the background
    console.log('Received setUserPreferences message', message.preferences);
    sendMessageToBackground({ type: 'preferencesUpdated', data: message.preferences });
    sendResponse({ status: 'success' });
  } else if (message.type === 'getUserPreferences') {
    // Respond with the current preferences from storage
    chrome.storage.local.get(['user_preferences'], (result) => {
      const preferences = result.user_preferences || {};
      sendResponse({ status: 'success', data: preferences });
    });
    return true; // Indicates async response
  }
});

// Example functionality to interact with the page, such as changing the background color
changeBackgroundColor();

// Optionally: If you want to send periodic updates or perform tasks every X seconds
setInterval(() => {
  sendMessageToBackground({ type: 'statusUpdate', message: 'Content script is active' });
}, 10000); // Send a status update every 10 seconds

// Inject CSS from the extension's resources (styles.css)
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = chrome.runtime.getURL('styles.css');
document.head.appendChild(link);

// Optional: Function to handle dynamic preference changes (e.g., font size, color scheme)
const applyUserPreferences = (preferences) => {
  if (preferences.backgroundColor) {
    document.body.style.backgroundColor = preferences.backgroundColor;
  }
  if (preferences.fontSize) {
    document.body.style.fontSize = preferences.fontSize;
  }
  if (preferences.textColor) {
    document.body.style.color = preferences.textColor;
  }
};

// Listen for preference updates and apply them dynamically
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'applyUserPreferences') {
    console.log('Applying user preferences:', message.preferences);
    applyUserPreferences(message.preferences);
    sendResponse({ status: 'success' });
  }
});

// Fetch and apply user preferences when the content script starts
chrome.runtime.sendMessage({ type: 'getUserPreferences' }, (response) => {
  if (response && response.status === 'success') {
    applyUserPreferences(response.data);
  } else {
    console.error('Failed to retrieve user preferences');
  }
});
