# VLSI Simplified — Trainer Education & Portfolio Website

A complete, production-grade, zero-cost shared web platform built with **React.js + Vite**, **Google Sheets**, and **Google Apps Script**. Specifically engineered for technical trainers teaching **Digital Systems**, **VLSI Design**, **Verilog**, **SystemVerilog**, and **UVM**.

---

## 🌟 Production CMS & Instant Static Architecture

```
                    ADMIN
                      │
                      ▼
              React Admin Panel
                      │  Save Changes
                      ▼
              Google Apps Script
                      │
                      ▼
                Google Sheets (Source of Truth)
                      │
                      │  [Publish Changes Trigger]
                      ▼
              Secure Publish Endpoint
                      │
                      ▼
          Automated Deployment Pipeline
          (GitHub Actions / Vercel / Netlify)
                      │
                      ▼  npm run sync-data (Atomic Validation)
                Static JSON Snapshot
                      │
                      ▼  npm run build
              Production CDN Deployment
                      │
                      ▼
                 PUBLIC SITE (0ms Instant Load)
                      │
                      ▼
                  STUDENTS
```

External Media:
- YouTube → Video hosting (Strictly external links in new tabs, NO embedded iframes)
- Google Drive → Lecture notes (Direct links in new tab with "Notes coming soon" fallback)
- Setup Guide → See [`AUTOMATIC_PUBLISH_SETUP.md`](./AUTOMATIC_PUBLISH_SETUP.md)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (Tested on v24.12.0)
- **npm**: v9.0.0 or later (Tested on v11.6.2)

### 2. Local Setup
```bash
# 1. Clone repository & install dependencies
git clone <repo-url>
cd Vlsi_Simplified
npm install

# 2. Configure environment (Optional for local preview)
cp .env.example .env

# 3. Start local development server
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## ☁️ Zero-Cost Backend Deployment (Google Apps Script)

Follow the complete step-by-step instructions in [`GOOGLE_APPS_SCRIPT_SETUP.md`](file:///c:/Users/HP/Desktop/Vlsi_Simplified/GOOGLE_APPS_SCRIPT_SETUP.md):
1. Create a Google Spreadsheet named `VLSI_Simplified_Database`.
2. Go to **Extensions** → **Apps Script**.
3. Copy and paste [`backend/Code.gs`](file:///c:/Users/HP/Desktop/Vlsi_Simplified/backend/Code.gs).
4. Run the one-click `setupSpreadsheet` function to auto-scaffold all 5 database sheets and headers.
5. In **Project Settings** → **Script Properties**, set `ADMIN_KEY` to your private passphrase (e.g. `trainer_secure_key_2026`).
6. Click **Deploy** → **New Deployment** → **Web App** (Execute as: **Me**, Access: **Anyone**).
7. Copy the generated Web App URL and set it in your `.env`:
   ```env
   VITE_API_BASE_URL=https://script.google.com/macros/s/AKfycb.../exec
   ```

---

## 🔒 Authentication & Security Architecture

### Compliance with Strict Security Requirements:
1. **Zero Hardcoded Secrets in Frontend**:
   - `const ADMIN_PASSWORD = "123456"` is strictly forbidden and nowhere in the codebase.
   - No passwords or API keys are stored in client JavaScript, environment bundles, or public source.
2. **Server-Side Authorization**:
   - Write actions (`createSubject`, `updateSubject`, `deleteSubject`, `createClass`, `updateClass`, `deleteClass`, `createQuiz`, `updateQuiz`, `deleteQuiz`, `updateTrainerProfile`) require an `adminToken`.
   - The token is verified server-side inside Google Apps Script against `PropertiesService.getScriptProperties().getProperty('ADMIN_KEY')`.
   - Client-side flags like `isAdmin: true` or `localStorage.isAdmin` are **never trusted** by the backend.
3. **Pluggable Abstraction Layer**:
   - Handled cleanly in `src/services/authService.js` and `src/contexts/AuthContext.jsx`.
   - Designed so you can easily plug in a managed auth provider (e.g., Supabase, Firebase, or custom JWT backend) in the future simply by switching the service implementation without refactoring your UI components.

---

## 📁 Project Structure

```
Vlsi_Simplified/
├── backend/
│   └── Code.gs                         # Production Google Apps Script backend code
├── GOOGLE_APPS_SCRIPT_SETUP.md         # Complete step-by-step setup guide
├── .env.example                        # Template for VITE_API_BASE_URL
├── index.html                          # HTML5 root with Plus Jakarta Sans & JetBrains Mono
├── package.json                        # Dependencies and scripts
├── vite.config.js                      # Vite bundler configuration
├── src/
│   ├── main.jsx                        # React root entry point
│   ├── App.jsx                         # App routes (Public + Protected Admin)
│   ├── config.js                       # Environment & API configurations
│   ├── index.css                       # Layout & utility classes
│   ├── styles/
│   │   └── theme.css                   # Dark Sky Blue + White theme (#0EA5E9, #071A2B)
│   ├── data/                           # Development fallback data
│   │   ├── initialSubjects.js
│   │   ├── initialClasses.js
│   │   ├── initialQuizzes.js
│   │   └── initialTrainerProfile.js
│   ├── services/
│   │   ├── apiService.js               # Network layer for Google Apps Script API
│   │   ├── authService.js              # Token session & auth abstraction
│   │   ├── courseService.js            # Subjects & Classes logic + dynamic class count
│   │   ├── quizService.js              # Quizzes & Questions API logic + scoring
│   │   └── portfolioService.js         # Trainer profile & statistics API logic
│   ├── contexts/
│   │   ├── AuthContext.jsx             # Admin authentication session provider
│   │   └── ToastContext.jsx            # Toast alert notification provider
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx              # Responsive header with mobile drawer
│   │   │   ├── Footer.jsx              # Footer with discreet admin link
│   │   │   ├── Button.jsx              # Button component with loading/icon support
│   │   │   ├── Modal.jsx               # Blur backdrop dialog
│   │   │   ├── ConfirmDialog.jsx       # Destructive action confirmation dialog
│   │   │   ├── Toast.jsx               # Alert notifications
│   │   │   ├── SearchBar.jsx           # Clean search input with clear button
│   │   │   ├── Badge.jsx               # Difficulty, status, and tag pills
│   │   │   ├── EmptyState.jsx          # Friendly empty and no-results states
│   │   │   └── LoadingSpinner.jsx      # Loading spinners
│   │   ├── courses/
│   │   │   ├── SubjectCard.jsx         # Card with dynamically calculated class count
│   │   │   └── ClassCard.jsx           # YouTube redirect (no iframes) + Drive notes
│   │   ├── quiz/
│   │   │   ├── QuizCard.jsx            # Quiz preview card
│   │   │   ├── QuizQuestion.jsx        # Single question player (options A/B/C/D)
│   │   │   ├── QuizTimer.jsx           # Countdown timer with warning threshold
│   │   │   └── QuizResult.jsx          # Results, score, retry, & technical explanations
│   │   └── admin/
│   │       ├── AdminLayout.jsx         # SaaS sidebar + top header
│   │       ├── AdminSidebar.jsx        # Collapsible responsive sidebar
│   │       ├── AdminHeader.jsx         # Status indicators & breadcrumbs
│   │       ├── StatsCard.jsx           # Admin metric card
│   │       └── ThumbnailPreview.jsx    # Live URL validation and preview box
│   ├── pages/
│   │   ├── HomePage.jsx                # Hero, Stats, About, Expertise, Timeline
│   │   ├── AboutPage.jsx               # Full trainer biography & philosophy
│   │   ├── CoursesPage.jsx             # Subjects overview & search
│   │   ├── SubjectClassesPage.jsx      # Classes per subject with YouTube/Notes links
│   │   ├── QuizListPage.jsx            # Quizzes catalog & difficulty filters
│   │   ├── QuizTakePage.jsx            # Active quiz player & results
│   │   ├── ContactPage.jsx             # Social links & inquiry form
│   │   ├── NotFoundPage.jsx            # 404 page
│   │   └── admin/
│   │       ├── AdminLoginPage.jsx      # Discreet login route (/admin/login)
│   │       ├── AdminDashboardPage.jsx  # Live dynamic dashboard metrics
│   │       ├── AdminSubjectsPage.jsx   # Full CRUD for subjects
│   │       ├── AdminClassesPage.jsx    # Full CRUD for classes (YouTube & Drive)
│   │       ├── AdminQuizzesPage.jsx    # Full CRUD for quizzes & questions
│   │       └── AdminPortfolioPage.jsx  # Trainer profile settings
│   └── routes/
│       └── ProtectedRoute.jsx          # Route guard for unauthenticated users
```

---

## 🎯 Verification Checklist

### Public Features
- [x] **Home**: Hero section, dynamic stats, about summary, technical expertise cards, timeline, and featured courses.
- [x] **Courses**: Subject cards show dynamically computed published class count (never hardcoded).
- [x] **Subject Classes**: Clicking a subject shows sequential lectures with thumbnails and descriptions.
- [x] **YouTube Redirection**: Clicking "Watch on YouTube" opens the original video in a new tab (`target="_blank" rel="noopener noreferrer"`). No embedded iframes.
- [x] **Google Drive Notes**: Clicking "Notes" opens Google Drive in a new tab. Missing notes display "Notes coming soon" gracefully.
- [x] **Quiz Engine**: 4 options per question, question progress bar, countdown timer, submission review with score, percentage, retry, and full explanations.
- [x] **Contact**: Trainer channels (YouTube, LinkedIn, Email) and functional inquiry message form.
- [x] **Mobile Responsive**: Tested across desktop, laptop, tablet, and mobile viewports with collapsible navigation.

### Admin Features
- [x] **Discreet Access**: Access via `/admin/login`.
- [x] **Security**: No hardcoded credentials; protected write routes verified server-side.
- [x] **Dashboard**: Dynamic counters for Total Subjects, Total Classes, Published Classes, Total Quizzes.
- [x] **Subject CRUD**: Add, edit, delete, and publish/unpublish with delete confirmation dialogs.
- [x] **Class CRUD**: Form with subject selector, class number, YouTube validation, Google Drive validation, and live thumbnail preview.
- [x] **Quiz CRUD**: Multi-question builder with Option A, B, C, D, correct answer selector, and explanations.
- [x] **Portfolio**: Update trainer biography, stats, and philosophy.
- [x] **Live Sync**: Changes update the central Google Sheet and immediately reflect across student devices.
