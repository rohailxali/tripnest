# Plan a route MVP Testing Guide

## 1. Test Plan

This document outlines the testing strategy for the **Plan a route MVP**. The objective is to verify that all core user flows—including authentication, trip creation, and dashboard management—function reliably. 

**Testing Approach:** All testing is currently **manual**. This ensures that the user interface, client-side validation, and mock API integrations perform correctly from an end-user perspective. Automated unit or integration testing is outside the scope of this MVP phase.

---

## 2. Test Cases Table

| Test Case ID | Feature | Input / Action | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-001** | User Signup | Valid Name, Email, and Password | User created, redirected to Dashboard. | *As Expected* | ✅ Pass |
| **TC-002** | User Login | Valid Email and Password | Successfully authenticates to Dashboard. | *As Expected* | ✅ Pass |
| **TC-003** | Dashboard Empty State | Log in with a fresh account | Displays "No trips yet" prompt and "Create Trip" button. | *As Expected* | ✅ Pass |
| **TC-004** | Trip Creation | Valid Destination, Dates, and Budget | Trip is generated, saved, and added to the dashboard. | *As Expected* | ✅ Pass |
| **TC-005** | Form Validation | Submit Trip Wizard with empty destination | Form blocks submission and highlights required field. | *As Expected* | ✅ Pass |
| **TC-006** | Trip Save/Load | Refresh the application on Dashboard | Trips are fetched from SQLite backend successfully. | *As Expected* | ✅ Pass |
| **TC-007** | Share Feature | Click "Share" on Trip Detail page | Modal opens, clicking "Copy" saves link to clipboard. | *As Expected* | ✅ Pass |
| **TC-008** | Profile Display | Navigate to Profile / Settings | Name displays as "Zohair" with correct Avatar seed. | *As Expected* | ✅ Pass |

---

## 3. Boundary and Error Cases

To ensure the application handles unexpected user behavior gracefully, the following edge cases were tested:

* **Empty form submission:** Submitting the login or register form with entirely blank inputs successfully triggers required field highlight errors.
* **Invalid email format:** Entering `test@test` or omitting the `@` symbol triggers HTML5 validation preventing form submission.
* **Very large budget input:** Entering a budget like `$999,999,999` in the Trip Planning Wizard is processed successfully without integer overflow, displaying formatted commas.
* **Missing required fields:** Skipping the 'Destination' field in the trip planner correctly halts the step progression until filled.

---

## 4. Screenshots & Visual Verification

*(Note: Replace placeholders below with actual project screenshots during review)*

- [Screenshot: Successful Login / Empty Dashboard State](./docs/assets/empty-dashboard.png)
- [Screenshot: Trip Creation Wizard](./docs/assets/trip-creation.png)
- [Screenshot: Trip Detail & Share Modal](./docs/assets/trip-share.png)
- [Screenshot: Validation Error Triggers](./docs/assets/validation-error.png)

---

## 5. Known Bug Fixes

Throughout the MVP refinement phase, the following issues were identified and resolved:
* **Dark Mode Desynchronization:** Dark mode state was previously lost on page refresh. Fixed by binding the HTML root class toggle to the saved `user.preferences.darkMode` state.
* **Concurrent Launch Failure:** The UI and backend originally required separate terminal tracking. Fixed by integrating `concurrently` in the `npm start` script.
* **Unused Import Errors:** Several `lucide-react` icons and unused components (like `MapTab`) caused compilation warnings. Fixed through a rigorous codebase cleanup sequence.
