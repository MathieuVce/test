# Immfly assessment

[![wakatime](https://wakatime.com/badge/github/MathieuVce/test.svg)](https://wakatime.com/badge/github/MathieuVce/test)

![React Native](https://img.shields.io/badge/React%20Native-0A80C1?style=flat&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)
![EAS Build](https://img.shields.io/badge/EAS-Build-blue?style=flat&logo=expo)
[![Firebase Functions](https://img.shields.io/badge/firebase-functions-blue)](https://firebase.google.com/docs/functions)


This project is a React Native application built with **Expo**.
It allows users to browse products, manage a cart, and complete payments with real-time stock updates using Firebase.

---

## Installation

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install --global expo-cli`)

---

### Steps
1. Clone the repository:
2. Navigate to the project folder:
3. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

4. Start the development server:
    ```bash
    expo start
     # or
    npm start
    ```

---

## Running the Project

Once the development server is running, you have several options:

- **On your phone:**
  Install the **Expo Go** app from the [App Store](https://apps.apple.com/app/expo-go/id982107779) or [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) and scan the QR code shown in your terminal.

- **On an emulator:**
  Press:
    - `i` for iOS simulator
    - `a` for Android emulator

---

## Notes
- Ensure your Firebase configuration file is correctly set up in the project.
- This project requires an active internet connection for Firebase integration.

---

# Code Logic Explanation

## User Flow (Front-End Perspective)

### Screen 1: Browsing & Selection
1. The database can be reset by clicking the arrow at the top right corner.
    - This generates random products with random prices and stock.
2. The user navigates through the product list (fetched from Firebase).
3. Each product shows stock and price (adapted to the selected currency).
4. When selecting a product, it is added to the cart with quantity handling.
5. The final price is displayed according to the selected currency and a ratio applied depending on the type of sale chosen.

---

### Screen 2: Cart Management
1. The cart updates in real time:
   - Items display their name, price (multiplied by quantity), and stock.
   - The user can increase, decrease, or remove items inside a modal on click.
   - A swipe gesture to the left deletes items.
2. Items from the cart during pending or split payment cannot be modified anymore.
   - Swipe and click interactions are disabled (`isFreezed` flag).

---

### Payment
1. The user can proceed to checkout with two options.
2. A payment modal opens, showing the total amount due.
3. The user can:
   - Enter the amount they wish to pay (validated in real time).
   - Cancel the process.
   - Confirm the payment.

---

### Validation Rules
- Input must be a positive number.
- Input must not exceed the total amount.
- On invalid input:
  - The input border turns red.
  - The **Validate** button is disabled.
- On valid input:
  - Partial payments are supported.
  - The remaining balance is recalculated and displayed until the full payment is completed.

---

### Stock Synchronization
- On the full payment:
  - Firebase is updated with new stock values.
  - Stock is decremented according to purchased quantities.
  - Products with zero stock remain in the database but cannot be selected again.
  - The cart is cleared.

---

## Code Logic (Back-End & State Management)

### State Management (MarketContext)
- Centralized context stores:
  - Cart items.
  - Current currency.
  - Auto-calculated final price whenever the cart updates.
- Provides getters and setters connected to Firebase.

- See this [PR description for the architecture](https://github.com/MathieuVce/test/pull/2)

---

### Cart logic
- The cart id updated when you click for the first time on an item and sets its quantity to 1 by default.
- The border when selected is blue, it turns red when you picked all the stock remaining.
- Possibility to add/remove from 0 to the stock amount.
- Items are sorted automatically by ascending price.
- The finalPrice is recalculated with a `useEffect` hook whenever the cart changes.

---

### Firebase Integration
- Products are stored in Firestore under the `products` collection.
- A mock data generator ensures:
  - Random stock values.
  - Prices with exchange rates.
  - At least six products available for demo purposes.
- Possibility to reset and refetch products for testing.
- Payment triggers a Firestore update to decrement stock.

---

### Theme & Styling

This project uses a **theme** that allows importing colors, scale sizes, and default radius values in a generic way.
It simplifies styling by centralizing design constants and ensures consistency across the app.

### Theme Features:
- **Colors**: Centralized color palette for consistent usage throughout the app.
- **Scale Size**: Responsive sizing that adapts to different screen dimensions.
- **Radius**: Default border radius values for uniform styling of components.
- **Responsive Design**: Built-in logic to adapt styles to various screen sizes.

You can import the theme anywhere in the project like this:
```javascript
import { COLORS, SIZES, FONTS } from '@/utils/theme';
```

---

### PR, commits & Demo

- [Screen1 product list items mocked](https://github.com/MathieuVce/test/pull/2)
- [Screen2 list items view with mocks](https://github.com/MathieuVce/test/pull/3)
- [Screen2 footer, seat selector and payment handling with API calls to database](https://github.com/MathieuVce/test/pull/4)
- [Integrate backend submodule and http requests](https://github.com/MathieuVce/test/pull/4)

---

# Backend Submodule Setup

This project uses a backend stored as a Git submodule. The Firebase backend server is located in this submodule.

### About the Backend

The Firebase backend server with the API endpoints is contained within this submodule. After initializing the submodule, you will have access to the complete backend code and deployment configuration.

[Backend README](market-test-immfly/backend/README.md)

## Setup Steps

### 1. Verify the submodule
```bash
git submodule status
```
This should show the path to the backend submodule.

### 2. Initialize and update the submodule
```bash
git submodule update --init --recursive
```
This clones the backend repository into your project.

### 3. Update the submodule later
To pull the latest changes from the backend repository:
```bash
git submodule update --remote
```
