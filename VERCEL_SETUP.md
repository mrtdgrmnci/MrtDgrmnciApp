# Vercel Setup - Quick Guide

## ✅ Vercel Token Obtained
Your Vercel token: `GfamdbHNRGMPY0BnTmP0zvoy`

## 🔍 Next Steps to Get Project Information

### Option 1: Using Vercel CLI
```bash
# Navigate to frontend directory
cd frontend

# Login to Vercel (if not already logged in)
vercel login

# Link project to Vercel
vercel link

# List projects to get Project ID and Org ID
vercel project ls
```

### Option 2: Using Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project (or create a new one)
3. Go to **Settings** tab
4. Look for:
   - **Project ID** (in the General section)
   - **Team ID** (this is your Org ID)

## 📋 GitHub Secrets to Add

Once you have the project information, add these secrets to your GitHub repository:

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add these secrets:

```
VERCEL_TOKEN=GfamdbHNRGMPY0BnTmP0zvoy
VERCEL_ORG_ID=your_org_id_here
VERCEL_PROJECT_ID=your_project_id_here
```

## 🚀 Quick Test

After adding the secrets, you can test the deployment:

```bash
# In frontend directory
vercel --prod
```

## 📝 What You Need to Find

- **Project ID**: Usually looks like `prj_xxxxxxxxxxxxxxxxxxxxxx`
- **Org ID**: Usually looks like `team_xxxxxxxxxxxxxxxxxxxxxx` or your username

## 🔗 Helpful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [GitHub Secrets Setup](https://docs.github.com/en/actions/security-guides/encrypted-secrets) 