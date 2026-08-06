# Deploying Access_AI to Render

This guide will walk you through deploying both your **Frontend (React)** and **Backend (Node.js)** to [Render](https://render.com/), a popular cloud hosting platform.

> [!WARNING]  
> **Important Database Note:** Currently, this project uses a local **SQLite** database (`database.db`). Render's free tier uses ephemeral file systems, meaning your database will be wiped clean every time the server goes to sleep or restarts.
> 
> **Solution:** To keep your data permanently, you must either:
> 1. Upgrade to a paid Render plan and attach a **Persistent Disk** to your backend.
> 2. *(Recommended)* Change your database from SQLite to a free **Supabase PostgreSQL** database, and connect it via environment variables.

---

## Part 1: Deploying the Backend (Web Service)

Your Node.js backend handles the Gemini AI requests and database storage.

1. **Log in to Render** and click **New +** -> **Web Service**.
2. **Connect your GitHub repository** containing the `Access_AI` project.
3. **Configure the Service**:
   - **Name:** `access-ai-backend` (or whatever you prefer)
   - **Root Directory:** `server` (This is critical so Render knows where the backend code is)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
4. **Environment Variables**:
   Scroll down and click **Add Environment Variable**. Add the following from your local `.env`:
   - `PORT`: `5000` (Render will automatically override this, but it's good practice to set it)
   - `JWT_SECRET`: (Paste your JWT secret here)
   - `GEMINI_API_KEY`: (Paste your Google Gemini API Key here)
5. **Deploy**: Click **Create Web Service**. 
   - Render will build and deploy your backend. It will give you a live URL like `https://access-ai-backend.onrender.com`. Save this URL!

---

## Part 2: Deploying the Frontend (Static Site)

Your React frontend needs to be built and served as static HTML/JS files.

1. First, you must tell your frontend where your live backend is. 
   - In your GitHub repo, edit `client/.env` (or create a Render environment variable in step 4 below) and set:
     `VITE_API_URL=https://access-ai-backend.onrender.com` *(Replace with your actual backend URL from Part 1)*
2. **Back in the Render Dashboard**, click **New +** -> **Static Site**.
3. **Connect your GitHub repository** again.
4. **Configure the Service**:
   - **Name:** `access-ai-frontend`
   - **Root Directory:** `client` (Critical!)
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist` (This is where Vite outputs the built files)
5. **Advanced Settings (Optional but Recommended)**:
   - If you have environment variables for the frontend, add them here.
   - For React Router to work correctly on refreshing pages, set a **Rewrite Rule**:
     - Source: `/*`
     - Destination: `/index.html`
     - Action: `Rewrite`
6. **Deploy**: Click **Create Static Site**.
   - Render will build your React app and provide you with your final, live website URL!

---

## Troubleshooting

- **CORS Errors**: If your frontend fails to talk to the backend, ensure that your backend's `cors` configuration in `server/index.js` allows requests from your new Render frontend URL.
- **500 Errors on Upload**: Render's free tier has strict memory limits. If your backend crashes when uploading large images (like 20MB), you may need to reduce the Multer file size limit in `ai.js` back to ~5MB.
