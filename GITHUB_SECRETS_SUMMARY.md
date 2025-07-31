# GitHub Secrets Configuration

## Required GitHub Secrets

Add these secrets to your GitHub repository at: `https://github.com/mrtdgrmnci/MrtDgrmnciApp/settings/secrets/actions`

### Vercel (Frontend) Secrets
- **VERCEL_TOKEN**: `GfamdbHNRGMPY0BnTmP0zvoy`
- **VERCEL_ORG_ID**: `00RRVL5N3fwgtVWl4J0pJq49`
- **VERCEL_PROJECT_ID**: `murats-projects-289fab2a`

### Railway (Backend) Secrets
- **RAILWAY_TOKEN**: `ea6ae6c0-5000-442b-a526-e39a22d74905`
- **RAILWAY_PROJECT_ID**: `199d2473-7533-4177-b2f8-3786d9c7f183`
- **RAILWAY_SERVICE**: `backend` (will be created on first deploy)

## How to Add Secrets

1. Go to your GitHub repository: https://github.com/mrtdgrmnci/MrtDgrmnciApp
2. Click on **Settings** tab
3. Click on **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret with the exact name and value above

## Next Steps After Adding Secrets

1. **Test Manual Deployments**:
   - Test Vercel deployment: `cd frontend && vercel --prod`
   - Test Railway deployment: `cd backend && railway up`

2. **Configure Custom Domain** (optional):
   - Purchase a domain
   - Configure DNS records
   - Add domain to Vercel and Railway

3. **Trigger Automated Deployments**:
   - Push to main branch to trigger GitHub Actions
   - Monitor deployment status

## Current Status

✅ **Vercel**: Ready for deployment
✅ **Railway**: Project created and linked
✅ **GitHub Actions**: Workflows configured
⏳ **Secrets**: Need to be added to GitHub
⏳ **Custom Domain**: Optional - can be configured later 