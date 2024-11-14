# **FairReview AI: Chrome Extension**

**FairReview AI** is a Chrome extension designed to automate the extraction, saving, loading, and clearing of product reviews from e-commerce websites. With an intuitive user interface and simple interaction, this tool provides users with the ability to efficiently manage and analyze product reviews on any webpage they visit.

## **Project Overview**

FairReview AI aims to simplify the process of reviewing product feedback across the web. By extracting reviews from e-commerce sites, users can quickly save, view, or clear them, making the decision-making process for purchases more efficient and organized. This extension is perfect for anyone looking to gather multiple reviews from a product page and analyze them without having to visit multiple sources.

## **Features**
- **Extract Reviews**: Scrapes the current webpage for reviews and displays them in the extension's popup.
- **Save Reviews**: Stores extracted reviews in the browser’s local storage for easy retrieval later.
- **Load Reviews**: Retrieves and displays previously saved reviews from the local storage.
- **Clear Reviews**: Deletes saved reviews from local storage and resets the extension interface.
- **User-friendly UI**: Simple, intuitive design for ease of use.
- **Loading Indicator**: Provides feedback while data is being processed.
- **Error Handling**: Alerts to notify the user if anything goes wrong.

## **Technologies Used**
- **JavaScript**: Main scripting language used for the extension's functionality.
- **HTML/CSS**: Structure and styling for the popup interface.
- **Chrome Extensions API**: Allows interaction with the browser and stores data in local storage.
- **Manifest V3**: Chrome Extension API version used for modern extension development.
- **JSON**: For storing review data locally.

## **Installation Instructions**

### **To Install Locally**:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Theoriginal007/FairReviewExtension.git

## Open Chrome and navigate to chrome://extensions/.
## Enable Developer Mode (toggle at the top-right of the page).
## Click on Load unpacked and select the directory where you cloned the repository.

## How It Works
Extracting Reviews:

When the user clicks the "Extract Reviews" button, the extension communicates with the current webpage to scrape all reviews visible on the page. These reviews are then displayed in the popup interface.
Saving Reviews:

Once reviews are displayed, the user can click "Save Reviews" to store them in the browser's local storage for later use.
Loading Reviews:

Users can click "Load Reviews" to retrieve previously saved reviews from local storage. This makes it easy to refer back to reviews without needing to extract them again.
Clearing Reviews:

If the user wants to delete the reviews, they can click "Clear Reviews," which will reset the stored reviews and UI.

## Usage
Once installed, click the extension icon in your browser’s toolbar to open the popup. The extension offers four key features:

Extract Reviews: Extracts reviews from the current webpage and displays them.
Save Reviews: Saves the extracted reviews into local storage.
Load Reviews: Retrieves saved reviews from local storage.
Clear Reviews: Clears saved reviews and resets the UI.
The popup interface also includes a loading indicator that is shown while reviews are being extracted, and alert messages to inform the user about the success or failure of each action.

## Demo
Here’s a quick demo of the extension in action:

Step 1: Click on "Extract Reviews" to pull reviews from the current page.
Step 2: Review the data displayed in the popup.
Step 3: Save reviews by clicking "Save Reviews".
Step 4: View or clear stored reviews using the "Load Reviews" and "Clear Reviews" buttons.

## API Usage
The extension communicates with the Chrome runtime and background script via chrome.runtime.sendMessage(), handling the following key actions:

extractReviews: Scrapes the current page for review data.
saveReviews: Saves the extracted reviews into local storage.
clearReviews: Clears stored reviews from local storage.
getStoredReviews: Retrieves saved reviews from local storage.

## Future Enhancements
Advanced Scraping Capabilities: Extend review extraction to support multiple website formats and handle dynamic content loading.
Data Export: Allow users to export saved reviews as CSV or JSON files for further analysis.
Offline Support: Implement offline capabilities by caching reviews for later access.
Enhanced User Interface: Improve the user interface by adding features like search or filter for reviews.
Unit Testing: Integrate unit testing to ensure the functionality of key features like review extraction and saving.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
Chrome Extensions API for providing a simple yet powerful way to build browser extensions.
Open-source community for contributing to JavaScript, HTML, CSS, and browser extension development best practices.