# Pro Sender

## Installation

1. Clone the repository:
    ```bash
    git clonegit@github.com:alphaextensions/pro-sender.git
    ```
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by clicking the toggle switch in the top right corner.
4. Click "Load unpacked" and select the cloned repository folder.

## Code Structure

### 📦 js/

**background.js**: Handles background processes and events for the extension.

**content.js**: Manages the interaction between the extension and the web page content.

**popup.js**: Handles the logic for the extension's popup UI.

**inject.js**: Implements the logic and functions from the WhatsApp API library, injecting them into the WhatsApp Web page.

#### 📂 js/utils 

- **data.js**: Contains constant or static data used by `content.js` and `popup.js`. This data is also updated by the config data API.
- **helper.js**: Contains common functions used by `content.js` and `popup.js`.
- **ga-code.js**: Tracks user activity on Google Analytics.
- **popup-handler.js** Contains all the popups displayed in content.

#### 📂 js/library

- **[xlsx.full.min.js](https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js)**: A library for reading and writing spreadsheet files.
- **[intlTelInput.min.js](https://cdnjs.com/libraries/intl-tel-input)**: A library for handling international telephone inputs.
- **[intlTelInput.utils.js](https://cdnjs.com/libraries/intl-tel-input)**: Utility functions for the international telephone input library.
- **[jquery.js](https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js)**: A fast, small, and feature-rich JavaScript library.
- **[libphonenumber.min.js](https://cdnjs.com/libraries/libphonenumber-js)**: Google's library for parsing, formatting, and validating international phone numbers.

> Note: The libraries in this folder should be updated to their latest versions when available. 

#### 📂 js/impact-hero

- Contains Javascripts for impact-hero SDK.