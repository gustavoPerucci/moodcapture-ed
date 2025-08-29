# Copilot Instructions for MoodCapture ED

## Project Overview
- **MoodCapture ED** is a privacy-focused, client-side React app for capturing, analyzing, and tracking user emotions via simulated AI (no backend).
- The app is structured for mobile-first use, with a main navigation and page-based flow.
- All emotion data is stored locally in the browser (see `src/lib/privacy.js`).

## Architecture & Data Flow
- **Entry Point:** `src/main.jsx` renders `App.jsx`.
- **Page Routing:** `App.jsx` manages page state (`home`, `capture`, `history`, `resources`, `settings`) and passes props to page components.
- **Emotion Analysis:**
  - `src/lib/emotionAnalysis.js` simulates AI emotion detection and manages local emotion history.
  - Emotion data is saved/retrieved using privacy helpers in `src/lib/privacy.js`.
- **UI Components:**
  - All UI primitives are in `src/components/ui/` (Radix UI + custom components).
  - Main pages: `src/components/` (e.g., `CameraCapture.jsx`, `HistoryPage.jsx`).
- **Data:**
  - Static wellness content in `src/data/wellnessContent.js`.

## Privacy & Data Handling
- All user data is stored in `localStorage` with optional anonymization and (disabled) encryption.
- Data retention and cleanup is managed automatically (see `PRIVACY_CONFIG` in `privacy.js`).
- No data is sent to a backend or third party.

## Developer Workflows
- **Start dev server:** `pnpm dev` (uses Vite)
- **Build for production:** `pnpm build`
- **Lint:** `pnpm lint`
- **Preview build:** `pnpm preview`
- **No backend or test suite is present.**

## Project Conventions
- Use React functional components and hooks only.
- Use the `@` alias for `src/` in imports (see `vite.config.js`).
- UI state is managed at the page/component level (no global state manager).
- All emotion analysis is simulated; do not add real AI/ML or backend calls.
- Follow privacy-first patterns: never persist or transmit PII.

## Examples
- To add a new emotion, update the `emotions` array in `src/lib/emotionAnalysis.js`.
- To add a new page, create a component in `src/components/` and update the `renderPage` switch in `App.jsx`.

## Key Files
- `src/App.jsx` – App shell, navigation, and page routing
- `src/lib/emotionAnalysis.js` – Simulated AI, emotion history, insights
- `src/lib/privacy.js` – Data privacy, storage, and cleanup
- `src/components/ui/` – UI primitives

---

If you are unsure about a workflow or pattern, check the referenced files for examples. When in doubt, prioritize privacy and local-only data handling.
