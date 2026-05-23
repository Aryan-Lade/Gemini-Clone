# Vercel Deployment Guide for Gemini Clone

## Prerequisites

- [Vercel Account](https://vercel.com/signup)
- GitHub repository (where your code is pushed)
- MongoDB Atlas account for database
- Google Cloud API key for Gemini API

## Quick Deployment Steps

### 1. Prepare Your Repository

```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Set Up Environment Variables

#### MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Create a database user and password

#### Google Gemini API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the Generative AI API
4. Create an API key
5. Copy the API key

#### Generate JWT Secret

```bash
# On Windows (PowerShell)
$secret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
Write-Host $secret

# Or use an online generator and make it strong (32+ characters)
```

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the repository
5. In "Environment Variables", add:
   - `MONGODB_URI` = Your MongoDB connection string
   - `GEMINI_API_KEY` = Your Gemini API key
   - `JWT_SECRET` = Your generated secret
   - `FRONTEND_URL` = Your Vercel deployment URL (e.g., https://your-project.vercel.app)
6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts and add environment variables when asked

# For production deployment
vercel --prod
```

### 4. Configure Environment Variables

After deployment, go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add the following:

- `MONGODB_URI`: Your MongoDB connection string
- `GEMINI_API_KEY`: Your Gemini API key
- `JWT_SECRET`: Your generated secret
- `FRONTEND_URL`: Your deployed URL

### 5. Deploy Your Backend

The backend is automatically deployed as serverless functions in the `/api` directory.

### 6. Test Your Deployment

1. Visit your Vercel URL
2. Create a new account
3. Try sending a message to Gemini Clone

## Project Structure for Vercel

```
gemini-clone/
├── api/
│   └── index.js          # Serverless function entry point
├── public/
│   ├── index.html        # Main chat page
│   ├── login.html        # Login/signup page
│   ├── css/
│   │   ├── main.css      # Chat styles
│   │   └── auth.css      # Auth styles
│   └── js/
│       ├── api.js        # API service
│       ├── app.js        # Chat app logic
│       └── auth.js       # Auth logic
├── backend/
│   ├── server.js         # Express server
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── middleware/       # Express middleware
├── vercel.json           # Vercel configuration
├── .vercelignore         # Files to ignore during deployment
└── .env.example          # Environment variables template
```

## Important Notes

### CORS Configuration

- The backend automatically allows requests from your Vercel domain
- Update `FRONTEND_URL` environment variable to match your deployment URL

### Database

- MongoDB must be configured for network access from Vercel
- Use MongoDB Atlas IP whitelist: Add `0.0.0.0/0` (allow all IPs)

### API Routing

- All API calls go through `/api/` endpoints
- Frontend automatically detects production vs. local environment

### First Time Setup

1. Vercel will automatically build and deploy on push
2. Deployment takes 2-3 minutes
3. Check deployment logs if there are issues

## Troubleshooting

### "Cannot find module" errors

- Clear Vercel cache and redeploy
- Vercel Dashboard → Settings → Git → Deployments → Clear Cache

### "Connection refused" errors

- Check MongoDB IP whitelist allows Vercel
- Verify MONGODB_URI is correct

### "API not working" errors

- Check environment variables are set correctly
- Check API logs in Vercel → Deployments → Function Logs

### "Login not working"

- Verify JWT_SECRET is set
- Check browser console for CORS errors

## Production Checklist

- [ ] MongoDB Atlas configured with strong password
- [ ] Gemini API key secured and set in environment variables
- [ ] JWT_SECRET is strong (32+ random characters)
- [ ] FRONTEND_URL matches your Vercel domain
- [ ] All environment variables are set in Vercel
- [ ] Tested login and chat functionality
- [ ] Verified API error handling works
- [ ] Checked database indexes are created

## Updates and Redeployment

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Vercel automatically deploys on push
# Or manually redeploy from dashboard
```

## Support

For issues with:

- **Vercel**: Check [Vercel Documentation](https://vercel.com/docs)
- **MongoDB**: Check [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- **Gemini API**: Check [Google AI Studio](https://aistudio.google.com/)

## Performance Optimization

- Vercel automatically optimizes static files
- API functions are auto-scaled based on traffic
- CDN caches frontend files globally
- MongoDB connection pooling configured

---

For more details, see [DEPLOYMENT.md](DEPLOYMENT.md)
