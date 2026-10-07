# Automatic "Save → Publish → Deploy" Production Setup

## Overview

VLSI Simplified employs a **decoupled CMS architecture**:
1. **Google Sheets** serves as the authoritative database for all curriculum, courses, classes, quizzes, and trainer profile information.
2. **React Admin Panel** allows the trainer to add, edit, or delete items and save them directly to Google Sheets.
3. **The "Publish Changes" trigger** notifies the deployment pipeline (GitHub Actions, Vercel, or Netlify) to pull latest data from Google Sheets, compile the static JSON snapshots, build the production assets, and deploy them.
4. **Public Students** browse the website with zero-latency instant rendering because their browsers read static JSON directly (no network wait on Google Apps Script).

---

## 👩‍🏫 Normal Client / Trainer Workflow (Zero Technical Knowledge Required)

The trainer does **NOT** need VS Code, terminal, npm, git, or manual deployments.

```
1. Open Admin Portal: /admin/login
2. Enter your private Admin Key
3. Add or edit any Subject, Class, Quiz, or Trainer Profile
4. Click "Save"
   ↳ The change is safely stored in Google Sheets immediately.
5. When ready to update the live student website, click "Publish Changes"
   ↳ A confirmation dialog will appear. Click "Publish".
6. The status changes to "Publish started. The public website is being updated."
7. In ~60–90 seconds, the new static website is live worldwide!
```

---

## ⚙️ One-Time Developer Setup

Choose either **Option A (Vercel / Netlify Deploy Hook - Simplest)** OR **Option B (GitHub Actions)**.

### Option A: Vercel or Netlify Deploy Hook (Recommended - 2 Minutes)

This is the simplest, zero-maintenance method.

#### 1. Create a Deploy Hook in Vercel or Netlify
- **In Vercel**:
  1. Open your project on Vercel: **Settings** → **Git** → scroll to **Deploy Hooks**.
  2. Click **Create Hook**:
     - Name: `VLSI Simplified CMS Publish`
     - Branch: `main`
  3. Copy the generated Webhook URL:
     `https://api.vercel.com/v1/integrations/deploy/prj_.../hook_...`

- **In Netlify**:
  1. Open your site on Netlify: **Site configuration** → **Build & deploy** → **Continuous deployment** → **Build hooks**.
  2. Click **Add build hook**:
     - Title: `VLSI Simplified CMS Publish`
     - Branch: `main`
  3. Copy the generated Webhook URL:
     `https://api.netlify.com/build_hooks/...`

#### 2. Configure in Google Apps Script
1. In your Google Spreadsheet, open **Extensions** → **Apps Script**.
2. Open **Project Settings** (gear icon) → **Script Properties**.
3. Click **Edit script properties** → **Add script property**:
   - Property: `DEPLOY_HOOK_URL`
   - Value: Paste your Vercel or Netlify Webhook URL.
4. Click **Save script properties**.

#### 3. Update Apps Script Code
Copy the latest [`backend/Code.gs`](file:///c:/Users/HP/Desktop/Vlsi_Simplified/backend/Code.gs) into your Apps Script editor and click **Deploy** → **Manage Deployments** → edit active deployment → choose **New version** → click **Deploy**.

> **How it works**: Whenever the trainer clicks "Publish Changes" in the Admin Panel, Apps Script securely pings `DEPLOY_HOOK_URL`. Vercel/Netlify executes `npm run build:prod` (which runs `sync-data` then `vite build`), deploying the fresh static JSON site immediately.

---

### Option B: GitHub Actions Workflow Dispatch

If you prefer GitHub Actions to build and commit updated static JSON directly into your git repository:

#### 1. Generate a GitHub Personal Access Token (PAT)
1. Go to GitHub: **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**.
2. Generate new token:
   - Note: `VLSI Apps Script Publish Dispatch`
   - Scopes: check `repo` and `workflow`.
3. Copy the token (`ghp_...`).

#### 2. Configure in Google Apps Script
1. In your Google Spreadsheet, open **Extensions** → **Apps Script**.
2. Go to **Project Settings** (gear icon) → **Script Properties**.
3. Add the following properties:
   - `GITHUB_REPO`: `your-github-username/Vlsi_Simplified`
   - `GITHUB_TOKEN`: `ghp_...` (your GitHub PAT)
   - `GITHUB_WORKFLOW`: `publish.yml` (optional, defaults to `publish.yml`)
   - `GITHUB_BRANCH`: `main` (optional, defaults to `main`)
4. Save properties.

#### 3. Configure GitHub Secrets
In your GitHub repository:
1. Go to **Settings** → **Secrets and variables** → **Actions**.
2. Add Repository Secret:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://script.google.com/macros/s/AKfycb.../exec` (your live Web App URL)

> **How it works**: Whenever the trainer clicks "Publish Changes", Google Apps Script triggers the `.github/workflows/publish.yml` workflow via GitHub's REST API. The action executes `npm run sync-data`, runs `npm run build`, and commits the latest static JSON files back to the repository.

---

## 🔒 Security Architecture Guarantees

1. **Zero Client Secrets**:
   - `ADMIN_KEY`, `GITHUB_TOKEN`, and `DEPLOY_HOOK_URL` exist **strictly** inside Google Apps Script Script Properties.
   - They are **never** present in the React bundle, `.env` frontend files, browser localStorage, or static JSON.
2. **Server-Side Authorization**:
   - Write and Publish actions require the admin session token, authenticated against `ADMIN_KEY` by Google Apps Script server-side.
3. **Double-Publish Prevention**:
   - The "Publish Changes" button enters a disabled loading state immediately upon click to prevent duplicate deployment triggers.
4. **Data Durability**:
   - If a deployment or sync fails, all changes remain safely preserved in Google Sheets, and existing static JSON snapshots are never corrupted.
