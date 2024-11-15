// reviewAnalyzer.js

/**
 * Analyzes reviews, determines sentiment, and assigns helpfulness scores.
 * @param {Array} reviews - Array of review objects.
 * @returns {Array} - Array of analyzed review objects with sentiment and helpfulness data.
 */
export function analyzeReviews(reviews) {
    if (!Array.isArray(reviews)) {
      throw new Error("Input should be an array of reviews.");
    }
  
    return reviews.map(review => {
      // Sanitize and ensure review data is consistent
      const sanitizedReview = sanitizeReviewData(review);
      const analysis = {
        ...sanitizedReview,
        sentiment: analyzeSentiment(sanitizedReview.content),
        verified: isVerifiedReview(sanitizedReview),
        helpfulScore: calculateHelpfulnessScore(sanitizedReview),
      };
  
      return analysis;
    });
  }
  
  /**
   * Ensures the review has required fields and sanitizes them.
   * @param {Object} review - Review data.
   * @returns {Object} - Sanitized review data.
   */
  function sanitizeReviewData(review) {
    if (!review || typeof review !== 'object') {
      throw new Error("Invalid review object.");
    }
  
    const content = review.content || '';
    return {
      id: review.id || generateUniqueId(),
      content,
      length: content.length,
      helpfulCount: review.helpfulCount || 0,
      verified: review.verified || false,
    };
  }
  
  /**
   * Analyzes the sentiment of the review using a simple keyword-based approach.
   * @param {string} text - Review text.
   * @returns {string} - Sentiment result: 'positive', 'negative', or 'neutral'.
   */
  function analyzeSentiment(text) {
    if (!text || typeof text !== 'string') {
      return 'neutral';
    }
  
    const sentimentScore = calculateSentimentScore(text);
    return sentimentScore > 0 ? 'positive' : sentimentScore < 0 ? 'negative' : 'neutral';
  }
  
  /**
   * Calculates sentiment score based on positive and negative words in the review.
   * @param {string} text - Review text.
   * @returns {number} - Sentiment score.
   */
  function calculateSentimentScore(text) {
    const positiveWords = ['good', 'great', 'excellent', 'love', 'perfect'];
    const negativeWords = ['bad', 'horrible', 'disappointing', 'terrible', 'worst'];
  
    let score = 0;
    const wordList = text.toLowerCase().split(/\s+/);
  
    wordList.forEach(word => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });
  
    return score;
  }
  
  /**
   * Determines if a review is verified based on the review object.
   * @param {Object} review - Review data.
   * @returns {boolean} - Whether the review is verified.
   */
  function isVerifiedReview(review) {
    return review && review.verified === true;
  }
  
  /**
   * Calculates a helpfulness score based on the number of helpful votes.
   * @param {Object} review - Review data.
   * @returns {number} - Helpfulness score.
   */
  function calculateHelpfulnessScore(review) {
    return review.helpfulCount > 0 ? review.helpfulCount : 0;
  }
  
  /**
   * Generates a unique ID for the review.
   * @returns {string} - Unique ID.
   */
  function generateUniqueId() {
    return 'rev-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  