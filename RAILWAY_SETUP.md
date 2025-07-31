# Railway Setup - Quick Guide

## 🚂 Railway Backend Deployment

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```

### Step 3: Initialize Railway Project
```bash
# Navigate to backend directory
cd backend

# Initialize Railway project
railway init

# Check project status
railway status
```

### Step 4: Get Railway Token
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click on your project
3. Go to **Settings** → **Tokens**
4. Create a new token with name "GitHub Actions"
5. Copy the token

### Step 5: Get Project Information
```bash
# Get project details
railway status

# List all projects
railway projects
```

## 📋 Railway GitHub Secrets

Add these secrets to your GitHub repository:

```
RAILWAY_TOKEN=your_railway_token_here
RAILWAY_PROJECT_ID=your_project_id_here
RAILWAY_SERVICE=your_service_name_here
```

## 🚀 Quick Test

After setup, test the deployment:

```bash
# In backend directory
railway up
```

## 📝 What You Need to Find

- **Project ID**: Usually looks like a UUID
- **Service Name**: Usually the name of your backend service
- **Railway Token**: The token you create in the Railway dashboard

## 🔗 Helpful Links

- [Railway Dashboard](https://railway.app/dashboard)
- [Railway CLI Documentation](https://docs.railway.app/reference/cli)
- [Railway GitHub Integration](https://docs.railway.app/deploy/deployments/github) 