Render Deployment
=================

Quick steps to deploy the `server` directory to Render (recommended):

1. Create a new Web Service on Render:
   - Connect your GitHub repository.
   - For **Root Directory** set: `server`
   - **Environment**: `Node` (default)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - Leave the default Branch and Name or choose as desired.

2. Add environment variables (Render -> Environment):
   - `MONGO_URI` — MongoDB connection string (production DB)
   - `JWT_SECRET` — strong secret for JWT signing
   - `CLIENT_URLS` — comma-separated allowed client origins (e.g. `http://localhost:5173,https://petconnectvercel.vercel.app`)
   - `PORT` — optional (Render sets a port automatically; code reads `process.env.PORT`)

3. Deploy and watch the logs. Render will run `npm install` then `npm start`.

4. Configure the frontend:
   - In Vercel project settings, add `VITE_API_URL` with the public URL of your Render service (e.g. `https://your-app.onrender.com`).
   - Redeploy the Vercel frontend (or push a commit) so `VITE_API_URL` is used at build time.

Notes and checks
----------------
- The `server` package.json already has a `start` script (`node server.js`) so Render's `npm start` will work.
- A `Procfile` with `web: npm start` has been added to make the start explicit.
- Ensure any DB credentials in the repository are rotated if they were checked in.

Troubleshooting
---------------
- If the process exits with EADDRINUSE or similar, ensure `process.env.PORT` is used (the code already does).
- Check Render service logs for `MONGO_URI` connection errors; ensure the database allows the Render IPs or uses an accessible Atlas cluster.

When done, tell me the Render public URL and I will walk you through setting `VITE_API_URL` in Vercel and testing end-to-end.
