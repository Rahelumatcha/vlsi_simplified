# Zero-Cost Backend Setup: Google Sheets & Google Apps Script

This guide provides step-by-step instructions to set up the **₹0 / Zero-Investment Shared Data Architecture** for **VLSI Simplified**.

With this architecture:
- **Google Sheets** serves as your real-time cloud database.
- **Google Apps Script** acts as your serverless backend REST/JSON API.
- Any change made by the trainer in the Admin Panel is immediately saved to Google Sheets and instantly visible to all students across all devices and browsers.
- No paid servers, databases, or monthly subscriptions are required.

---

## Architecture Overview

```
Students & Trainer (Browsers)
            │
            ▼
    React + Vite Frontend (Vercel / Netlify)
            │
            ▼  HTTPS JSON Calls
   Google Apps Script API (doGet / doPost)
            │
            ▼
       Google Sheets (Cloud Database)
     ├── Subjects
     ├── Classes
     ├── Quizzes
     ├── QuizQuestions
     └── TrainerProfile
```

---

## Step 1: Create Your Google Spreadsheet

1. Open [Google Sheets](https://sheets.new) in your Google account.
2. Name the spreadsheet: **`VLSI_Simplified_Database`**.
3. Note the **Spreadsheet ID** from the browser URL:
   `https://docs.google.com/spreadsheets/d/`**`<YOUR_SPREADSHEET_ID>`**`/edit`

---

## Step 2: Open Google Apps Script

1. Inside your new spreadsheet, click the top menu: **Extensions** → **Apps Script**.
2. A new tab will open with the Apps Script editor.
3. Rename the project from *Untitled project* to **`VLSI_Simplified_Backend`**.

---

## Step 3: Paste the Backend Code

1. In the editor, open the file `Code.gs`.
2. Delete any existing code (`function myFunction() {...}`).
3. Open the file [`backend/Code.gs`](file:///c:/Users/HP/Desktop/Vlsi_Simplified/backend/Code.gs) from this project and copy its entire contents.
4. Paste it into the Apps Script editor `Code.gs`.
5. Click the **Save** icon (Floppy disk) or press `Ctrl + S`.

---

## Step 4: Run the Automatic One-Click Setup

1. In the toolbar at the top of Apps Script, select the function **`setupSpreadsheet`** from the dropdown menu (next to *Debug* and *Run*).
2. Click **Run**.
3. Google will ask for authorization on the first run:
   - Click **Review Permissions**.
   - Select your Google Account.
   - Click **Advanced** → Click **Go to VLSI_Simplified_Backend (unsafe)**.
   - Click **Allow**.
4. The execution log will show:
   `"Spreadsheet successfully initialized with all required sheets and headers."`
5. Switch back to your Google Spreadsheet tab! You will see 5 tabs automatically created:
   - **`Subjects`**
   - **`Classes`**
   - **`Quizzes`**
   - **`QuizQuestions`**
   - **`TrainerProfile`**

---

## Step 5: Configure Admin Security Key (Script Properties)

To protect write operations (Create, Edit, Delete) so only you (the trainer) can modify data:

1. In the Apps Script left sidebar, click the **Project Settings** gear icon (⚙️).
2. Scroll down to **Script Properties**.
3. Click **Edit script properties** → **Add script property**:
   - **Property**: `ADMIN_KEY`
   - **Value**: Enter your private admin key / passphrase (e.g. `vlsi_trainer_secure_key_2026`).
4. Click **Save script properties**.

> [!NOTE]
> This key is stored securely inside Google's cloud and is NEVER exposed in the frontend code. When you log into the Admin Panel at `/admin/login`, you enter this key to obtain an authorized session for write operations.

---

## Step 6: Deploy as Web App

1. In the top-right corner of the Apps Script editor, click the blue **Deploy** button → **New deployment**.
2. Click the gear icon (⚙️) next to *Select type* and select **Web app**.
3. Configure the deployment settings:
   - **Description**: `VLSI Simplified Production API v1`
   - **Execute as**: **Me (your-email@gmail.com)**
   - **Who has access**: **Anyone** *(Essential so student browsers can fetch published courses without needing to log into Google)*.
4. Click **Deploy**.
5. Copy the **Web App URL** generated. It will look like:
   `https://script.google.com/macros/s/AKfycbx.../exec`

---

## Step 7: Connect the React Frontend

1. In your project root, open or create `.env`:
   ```bash
   VITE_API_BASE_URL=https://script.google.com/macros/s/AKfycbx.../exec
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Test connectivity:
   - Open your browser to `http://localhost:3000`.
   - The app will automatically connect to your Google Apps Script backend.
   - Open `/admin/login` and enter your Admin Key to manage courses, classes, quizzes, and your trainer profile!

---

## Step 8: Deploying to Netlify / Vercel (Zero Cost)

1. Push your repository to **GitHub**.
2. Go to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) and import your repository.
3. In the build settings:
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_BASE_URL` = `https://script.google.com/macros/s/AKfycbx.../exec`
5. Click **Deploy**. Your website is now live worldwide at zero cost!

---

## Updating Backend Code Later
If you ever edit `Code.gs`:
1. Click **Deploy** → **Manage deployments**.
2. Click the **Edit** pencil icon on the active deployment.
3. Under *Version*, select **New version**.
4. Click **Deploy**.
*(Google Apps Script requires creating a new version for changes to take effect on the web app URL).*
