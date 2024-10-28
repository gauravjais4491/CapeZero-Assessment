## Description

**UI Automation Project for Amazon Website**

This project provides UI automation scripts for the Amazon website, utilizing TypeScript and the Playwright library.

## Installation

1. Download and install [Node.js](https://nodejs.org/en/download/)
2. Install VS Code.
3. Download or clone the repo to your system.
4. Open the project in VS Code, then open the terminal (`View > Terminal` in the menu).
5. Run `npm run install-dependency` in the terminal to install all required dependencies and create the `node_modules` folder.

## Getting Started with UI Automation

1. UI Test Automation Approach:
   - The Page Object Model (POM) approach is used to organize test cases.
   - Create page classes for individual features under the `PageObjects` folder.
   - Write test cases in files located within the `tests` folder.

2. Folder Structure:
   - `PageObjects`: Contains classes for different feature pages.
   - `tests`: Contains test cases organized by page.
   - `Data`: Stores data related to test cases.
   - `Fixtures`: Contains setup configurations.

## Configuration

1. Add Credentials:
   - Create a `.env` file in the root directory to securely store Amazon test account credentials.
   - Add the following to your `.env` file:
     ```plaintext
     EMAIL=your_amazon_test_account_email
     PASSWORD=your_amazon_test_account_password
     BASE_URL=https://www.amazon.in/
     ```
     - Replace `your_amazon_test_account_email` and `your_amazon_test_account_password` with your credentials.
     - Ensure `BASE_URL` points to Amazon's homepage (e.g., https://www.amazon.in/).
   
2. **Important**: Disable Two-Step Authentication for this account to prevent interruptions during automated testing.

## Running Test Cases

1. Run Test Cases:
   - **Regression Tests**: `npm run regression-tests`
   - **Sanity Tests**: `npm run sanity-tests`
   - **All Tests**: `npm run all-tests`
   - **Filter Product Tests Only**: `npm run filter-tests`
   - **Search Product Tests Only**: `npm run search-tests`
   - **Add to Cart Tests Only**: `npm run addToCart-tests`

2. Generate and View Allure Reports:
   - **Generate Report**: `npm run allure-generate`
   - **Open Report**: `npm run allure-open`

3. View Playwright Html Reports:
   - **Open-Report**: `npm run open-html-report`
