// DOM Elements
const elements = {
    extractReviewsBtn: document.getElementById('extractReviewsBtn'),
    saveReviewsBtn: document.getElementById('saveReviewsBtn'),
    clearReviewsBtn: document.getElementById('clearReviewsBtn'),
    loadReviewsBtn: document.getElementById('loadReviewsBtn'),
    reviewsContainer: document.getElementById('reviewsContainer'),
    loadingMessage: document.getElementById('loadingMessage'),
  };
  
  let extractedReviews = [];
  
  // Event Listeners
  elements.extractReviewsBtn.addEventListener('click', handleExtractReviews);
  elements.saveReviewsBtn.addEventListener('click', handleSaveReviews);
  elements.clearReviewsBtn.addEventListener('click', handleClearReviews);
  elements.loadReviewsBtn.addEventListener('click', handleLoadReviews);
  
  // Main Event Handlers
  async function handleExtractReviews() {
    await executeAction('extractReviews', 'Extracting reviews...', extractReviewsFromPage);
  }
  
  async function handleSaveReviews() {
    if (!extractedReviews.length) {
      return showAlert('No reviews to save.', 'warning');
    }
    await executeAction('saveReviews', 'Saving reviews...', saveReviewsToStorage);
  }
  
  async function handleClearReviews() {
    await executeAction('clearReviews', 'Clearing reviews...', clearStoredReviews);
  }
  
  async function handleLoadReviews() {
    await executeAction('getStoredReviews', 'Loading reviews...', loadStoredReviews);
  }
  
  // Reusable Functions
  async function executeAction(action, loadingText, actionFunction) {
    toggleLoading(true, loadingText);
  
    try {
      const response = await sendMessageToBackground({ action });
      if (response.status === 'success') {
        await actionFunction(response);
      } else {
        throw new Error(response.message || 'Unknown error occurred.');
      }
    } catch (error) {
      handleError(error);
    } finally {
      toggleLoading(false);
    }
  }
  
  async function extractReviewsFromPage(response) {
    extractedReviews = validateReviews(response.reviews || []);
    displayReviews(extractedReviews);
    showAlert('Reviews extracted successfully!', 'success');
    toggleButtons(true);
  }
  
  async function saveReviewsToStorage() {
    try {
      await sendMessageToBackground({ action: 'saveReviews', reviews: extractedReviews });
      showAlert('Reviews saved successfully!', 'success');
      toggleButtons(false);
    } catch (error) {
      handleError(error);
    }
  }
  
  async function clearStoredReviews() {
    try {
      await sendMessageToBackground({ action: 'clearReviews' });
      showAlert('Reviews cleared successfully!', 'success');
      extractedReviews = [];
      displayReviews([]);
      toggleButtons(false);
    } catch (error) {
      handleError(error);
    }
  }
  
  async function loadStoredReviews() {
    try {
      const response = await sendMessageToBackground({ action: 'getStoredReviews' });
      if (response.status === 'success') {
        displayReviews(response.reviews || []);
        showAlert('Reviews loaded successfully!', 'success');
      } else {
        showAlert('No reviews found in storage.', 'info');
      }
    } catch (error) {
      handleError(error);
    }
  }
  
  // Communication with Background Script
  function sendMessageToBackground(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError || !response) {
          reject(new Error('Failed to communicate with the background script.'));
        } else {
          resolve(response);
        }
      });
    });
  }
  
  // DOM Manipulation
  function displayReviews(reviews) {
    elements.reviewsContainer.innerHTML = ''; // Clear existing reviews
  
    if (!reviews.length) {
      elements.reviewsContainer.innerHTML = '<p>No reviews available.</p>';
      return;
    }
  
    const fragment = document.createDocumentFragment();
    reviews.forEach((review) => {
      const reviewElement = createReviewElement(review);
      fragment.appendChild(reviewElement);
    });
    elements.reviewsContainer.appendChild(fragment);
  }
  
  function createReviewElement(review) {
    const reviewElement = document.createElement('div');
    reviewElement.classList.add('review-item');
    reviewElement.textContent = review;
    return reviewElement;
  }
  
  // UX Enhancements
  function toggleLoading(isLoading, message = '') {
    elements.loadingMessage.textContent = message;
    elements.loadingMessage.classList.toggle('show', isLoading);
  }
  
  function showAlert(message, type = 'info') {
    const alertElement = document.createElement('div');
    alertElement.classList.add('alert', `alert-${type}`);
    alertElement.textContent = message;
  
    document.body.appendChild(alertElement);
    setTimeout(() => alertElement.remove(), 3000);
  }
  
  function toggleButtons(enable = true) {
    elements.saveReviewsBtn.disabled = !enable;
    elements.clearReviewsBtn.disabled = !enable;
  }
  
  // Error Handling
  function handleError(error) {
    console.error('Error:', error);
    showAlert(error.message || 'An unexpected error occurred.', 'danger');
  }
  
  // Validation
  function validateReviews(reviews) {
    if (!Array.isArray(reviews)) {
      throw new Error('Invalid reviews data.');
    }
    return reviews.filter((review) => typeof review === 'string' && review.trim().length > 0);
  }
  
  // Styling the DOM Elements
  function applyStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .alert {
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
        font-size: 14px;
        text-align: center;
      }
      .alert-info { background-color: #d1ecf1; color: #0c5460; }
      .alert-success { background-color: #d4edda; color: #155724; }
      .alert-danger { background-color: #f8d7da; color: #721c24; }
      .review-item {
        padding: 8px;
        margin: 5px 0;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: #f9f9f9;
      }
      #loadingMessage.show { display: block; }
      #loadingMessage { display: none; font-weight: bold; color: #007bff; }
    `;
    document.head.appendChild(style);
  }
  
  applyStyles();
  