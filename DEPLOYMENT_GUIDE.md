# JobBridge Deployment Guide

This guide will help you deploy your full-stack Job Portal "at any cost". We will use free tiers where possible.

## 1. Prerequisites (GitHub Upload)

Before deploying, your code must be on GitHub. I have fixed the "bug" that prevents upload (large `pgdata` folder).

**Steps:**
1.  Go to the project root folder.
2.  Double-click `git_setup.bat`. This will:
    -   Initialize Git.
    -   Fix `.gitignore` to exclude the database folder.
    -   Commit your code.
3.  Create a new repository on [GitHub](https://github.com/new).
4.  Run the commands shown at the end of the `git_setup.bat` script (remote add, push).

---

## 2. Database Deployment (Neon / Supabase)

Since you cannot upload your local `pgdata` to the cloud, you need a cloud database.

**Option A: Neon (Recommended for Free Tier)**
1.  Go to [Neon.tech](https://neon.tech/) and sign up.
2.  Create a new Project.
3.  Copy the **Connection String** (e.g., `postgres://user:pass@ep-xyz.aws.neon.tech/neondb...`).
4.  **Save this string**, you will need it for the Backend env vars later.

---

## 3. Backend Deployment (Render)

We will deploy the Node.js backend to Render.

1.  Go to [Render.com](https://render.com/) and sign up.
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  Select the `backend` folder as the **Root Directory**.
5.  **Settings:**
    -   **Name:** `job-portal-api`
    -   **Runtime:** Node
    -   **Build Command:** `npm install`
    -   **Start Command:** `node server.js`
6.  **Environment Variables:** (Click "Advanced" or "Environment")
    -   `PORT`: `10000` (Render detects this automatically)
    -   `DB_HOST`: (From Neon, usually `ep-xyz.aws.neon.tech`)
    -   `DB_USER`: (From Neon)
    -   `DB_PASS`: (From Neon)
    -   `DB_NAME`: `neondb` (Default for Neon)
    -   `JWT_SECRET`: `created-by-antigravity-secure-key`
7.  Click **Create Web Service**.
8.  **Wait for deployment.** Once live, copy the URL (e.g., `https://job-portal-api.onrender.com`).

---

## 4. Frontend Deployment (Vercel)

We will deploy the React frontend to Vercel.

1.  Go to [Vercel.com](https://vercel.com/) and sign up.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure Project:**
    -   **Framework Preset:** Vite
    -   **Root Directory:** click `Edit` and select `frontend`.
5.  **Environment Variables:**
    -   You need to tell the frontend where the backend is.
    -   If your frontend code uses `localhost:5000`, you must find and replace it with your new Render Backend URL.
    -   *Best Practice:* Update `frontend/.env` (or Vercel env vars) if you used `VITE_API_URL`.
    -   **Quick Fix:** If you hardcoded `http://localhost:5000` in the code, you **must** replace it with `https://job-portal-api.onrender.com` in your code and push to GitHub *before* deploying to Vercel.
6.  Click **Deploy**.

---

## 5. Summary

-   **Database:** Hosted on Neon.
-   **Backend:** Hosted on Render, connected to Neon.
-   **Frontend:** Hosted on Vercel, pointing to Render Backend.

**Congratulations! Your JobBridge portal is live!**
