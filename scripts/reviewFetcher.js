// reviewFetcher.js

/**
 * Fetches reviews asynchronously from the DOM.
 * @returns {Array} - List of reviews extracted from the page.
 */
export async function fetchReviews() {
    const reviews = [];
  
    try {
      const reviewElements = document.querySelectorAll('.review, .product-review');
      if (reviewElements.length === 0) {
        console.warn("No reviews found on this page.");
        return reviews;
      }
  
      // Using async/await to fetch review data in parallel
      const reviewPromises = Array.from(reviewElements).map(async (element) => {
        return await extractReviewData(element);
      });
  
      reviews.push(...await Promise.all(reviewPromises));
  
    } catch (error) {
      console.error("Error fetching reviews: ", error);
    }
  
    return reviews;
  }
  
  /**
   * Extracts review data from an individual DOM element.
   * @param {Element} reviewElement - DOM element containing review data.
   * @returns {Object} - Extracted review object.
   */
  async function extractReviewData(reviewElement) {
    const review = {
      id: reviewElement.getAttribute('data-review-id') || generateUniqueId(),
      content: extractReviewContent(reviewElement),
      verified: isVerifiedReview(reviewElement),
      helpfulCount: parseInt(extractHelpfulCount(reviewElement), 10) || 0,
      rating: await extractReviewRating(reviewElement),
    };
  
    return review;
  }
  
  /**
   * Extracts the content of a review.
   * @param {Element} reviewElement - DOM element containing review content.
   * @returns {string} - The review content.
   */
  function extractReviewContent(reviewElement) {
    const contentElement = reviewElement.querySelector('.review-text');
    return contentElement ? contentElement.innerText : '';
  }
  
  /**
   * Determines if a review is verified based on its DOM class or attributes.
   * @param {Element} reviewElement - DOM element containing review data.
   * @returns {boolean} - Whether the review is verified.
   */
  function isVerifiedReview(reviewElement) {
    return reviewElement.classList.contains('verified-buyer');
  }
  
  /**
   * Extracts the number of helpful votes for a review.
   * @param {Element} reviewElement - DOM element containing helpful votes data.
   * @returns {string} - The number of helpful votes.
   */
  function extractHelpfulCount(reviewElement) {
    const helpfulCountElement = reviewElement.querySelector('.helpful-count');
    return helpfulCountElement ? helpfulCountElement.innerText : '0';
  }
  
  /**
   * Extracts the rating value of the review.
   * @param {Element} reviewElement - DOM element containing rating data.
   * @returns {number} - Rating value.
   */
  async function extractReviewRating(reviewElement) {
    const ratingElement = reviewElement.querySelector('.review-rating');
    const rating = ratingElement ? ratingElement.innerText : '0';
    const match = rating.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : 0;
  }
  
  /**
   * Generates a unique ID for the review if it doesn't have one.
   * @returns {string} - Unique ID.
   */
  function generateUniqueId() {
    return 'rev-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  