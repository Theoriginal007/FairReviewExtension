// utils.js

/**
 * Debounce function to limit how often a function is executed.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The delay between calls.
 * @param {boolean} immediate - Whether to call the function immediately.
 * @returns {Function} - The debounced function.
 */
export function debounce(func, wait, immediate = false) {
    let timeout;
    return function (...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
  
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
  
      if (callNow) func.apply(this, args);
    };
  }
  
  /**
   * Saves data to localStorage with error handling.
   * @param {string} key - The key to store the data under.
   * @param {any} value - The value to store.
   */
  export function saveToStorage(key, value) {
    if (!key || value === undefined) {
      console.error("Invalid arguments passed to saveToStorage.");
      return;
    }
  
    try {
      const dataToStore = JSON.stringify(value);
      localStorage.setItem(key, dataToStore);
    } catch (error) {
      console.error("Error saving to localStorage: ", error);
    }
  }
  
  /**
   * Loads data from localStorage with error handling.
   * @param {string} key - The key to retrieve the data for.
   * @returns {any} - The parsed data from localStorage.
   */
  export function loadFromStorage(key) {
    if (!key) {
      console.error("Key is required to load from localStorage.");
      return null;
    }
  
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error loading from localStorage: ", error);
      return null;
    }
  }
  
  /**
   * Deep clones an object to ensure immutability.
   * @param {Object} obj - The object to clone.
   * @returns {Object} - The cloned object.
   */
  export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  