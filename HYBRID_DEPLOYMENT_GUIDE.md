# Hybrid Deployment: Frontend (Hostinger) + Backend (Railway)

## Step 1: Update Frontend Environment Variables

Create/update `.env.production` in frontend folder:

```env
VITE_API_URL=https://your-railway-backend-url.up.railway.app
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

## Step 2: Build Frontend for Production

```bash
cd frontend
npm run build
```

This creates a `dist/` folder with production-ready files.

## Step 3: Deploy Backend to Railway

### 3.1 Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub (free, no credit card needed)

### 3.2 Connect Repository
- Click "New Project" → "Deploy from GitHub repo"
- Connect your GitHub repository
- Railway auto-detects Node.js and starts deployment

### 3.3 Configure Environment Variables in Railway
In Railway dashboard:
- Go to your project → Variables
- Add these variables:
```
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
COMPANY_NAME=ChaseNorth
# ... add all other environment variables
```

### 3.4 Add Custom Domain (Optional)
- In Railway: Project Settings → Domains
- Add `api.chasenorth.com` or similar

## Step 4: Deploy Frontend to Hostinger

### 4.1 Upload Files
- Go to Hostinger File Manager
- Upload all files from `frontend/dist/` to `public_html/` folder
- Make sure `index.html` is in the root

### 4.2 Configure Domain
- Point `chasenorth.com` to Hostinger hosting
- Point `api.chasenorth.com` to Railway (if using custom domain)

## Step 5: Update CORS in Backend

In `backend/server.js`, add your Hostinger domain to allowed origins:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:9000',
  'http://localhost:4173',
  'https://chasenorth.com',        // Your Hostinger frontend
  'https://www.chasenorth.com',    // With www
  'https://api.chasenorth.com'     // Your Railway backend (if custom domain)
];
```

## Architecture Overview

```
User Browser → chasenorth.com (Hostinger) → api.chasenorth.com (Railway)
       ↓              ↓                           ↓
   Static Files    API Calls → Proxy to       Node.js Server
   (HTML/CSS/JS)   Backend                    (Express + MongoDB)
```

## Benefits of This Setup

✅ **Frontend**: Cheap static hosting ($1-3/month)
✅ **Backend**: Free Node.js hosting
✅ **Scalable**: Can upgrade either part independently
✅ **Fast**: Frontend served from CDN, backend auto-scales

## Testing

After deployment:
1. Frontend loads from `https://chasenorth.com`
2. API calls go to `https://your-railway-url.up.railway.app`
3. Test login, shopping cart, checkout flows

Would you like me to help you set up the Railway deployment?