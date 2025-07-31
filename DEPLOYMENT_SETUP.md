# Deployment Setup Guide - MRT Portfolio

This guide will walk you through setting up deployment secrets and configuring a custom domain for your portfolio.

## Step 1: Configure GitHub Secrets

### 1.1 Vercel Setup (Frontend)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Get Vercel Tokens**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click on your profile → Settings → Tokens
   - Create a new token with name "GitHub Actions"
   - Copy the token

4. **Get Project Information**:
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Link to Vercel project (if not already linked)
   vercel link
   
   # Get project info
   vercel project ls
   ```

5. **Add Vercel Secrets to GitHub**:
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add these secrets:
     ```
     VERCEL_TOKEN=your_vercel_token_here
     VERCEL_ORG_ID=your_org_id_from_vercel
     VERCEL_PROJECT_ID=your_project_id_from_vercel
     ```

### 1.2 Railway Setup (Backend)

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Create Railway Project**:
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Initialize Railway project
   railway init
   
   # Get project info
   railway status
   ```

4. **Get Railway Tokens**:
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click on your project
   - Go to Settings → Tokens
   - Create a new token
   - Copy the token

5. **Add Railway Secrets to GitHub**:
   ```
   RAILWAY_TOKEN=your_railway_token_here
   RAILWAY_PROJECT_ID=your_project_id_from_railway
   RAILWAY_SERVICE=your_service_name
   ```

### 1.3 Optional: Slack Notifications

1. **Create Slack Webhook**:
   - Go to [Slack Apps](https://api.slack.com/apps)
   - Create New App → From scratch
   - Add "Incoming Webhooks" feature
   - Create webhook for your channel
   - Copy webhook URL

2. **Add Slack Secret**:
   ```
   SLACK_WEBHOOK_URL=your_slack_webhook_url
   ```

## Step 2: Custom Domain Configuration

### 2.1 Domain Registration

1. **Purchase Domain** (if you don't have one):
   - Recommended: [Namecheap](https://namecheap.com), [Google Domains](https://domains.google), or [Cloudflare](https://cloudflare.com)
   - Choose a professional domain (e.g., `mrtdgrmnci.com`, `mrt-portfolio.com`)

### 2.2 Vercel Custom Domain Setup

1. **Add Custom Domain to Vercel**:
   ```bash
   # In your frontend directory
   vercel domains add your-domain.com
   ```

2. **Configure DNS Records**:
   - Go to your domain registrar's DNS settings
   - Add these records:
     ```
     Type: A
     Name: @
     Value: 76.76.19.19
     
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

3. **SSL Certificate**:
   - Vercel automatically provides SSL certificates
   - Wait 24-48 hours for propagation

### 2.3 Railway Custom Domain Setup

1. **Add Custom Domain to Railway**:
   ```bash
   # In your backend directory
   railway domain add api.your-domain.com
   ```

2. **Configure DNS Records**:
   ```
   Type: CNAME
   Name: api
   Value: your-railway-app.railway.app
   ```

### 2.4 Environment Configuration

1. **Update Frontend Environment**:
   Create `frontend/.env.production`:
   ```
   VITE_API_URL=https://api.your-domain.com
   VITE_APP_URL=https://your-domain.com
   ```

2. **Update Backend Environment**:
   Create `backend/.env.production`:
   ```
   CORS_ORIGIN=https://your-domain.com
   NODE_ENV=production
   ```

## Step 3: Test Deployment

### 3.1 Manual Deployment Test

1. **Test Frontend Deployment**:
   ```bash
   cd frontend
   vercel --prod
   ```

2. **Test Backend Deployment**:
   ```bash
   cd backend
   railway up
   ```

### 3.2 Automated Deployment Test

1. **Trigger GitHub Actions**:
   - Go to your GitHub repository
   - Actions → Deploy to Production
   - Click "Run workflow"

2. **Monitor Deployment**:
   - Watch the Actions tab for progress
   - Check for any errors
   - Verify health checks pass

## Step 4: Post-Deployment Verification

### 4.1 Health Checks

1. **Frontend Health Check**:
   ```bash
   curl -I https://your-domain.com
   ```

2. **Backend Health Check**:
   ```bash
   curl -I https://api.your-domain.com/api/health
   ```

### 4.2 Functionality Tests

1. **Test Portfolio Pages**:
   - Home page loads correctly
   - Projects page displays data
   - Blog posts are accessible
   - Contact form works

2. **Test Admin Features**:
   - Admin login works
   - Dashboard displays correctly
   - Contact messages are accessible

## Troubleshooting

### Common Issues

1. **DNS Propagation**:
   - Can take up to 48 hours
   - Use [whatsmydns.net](https://whatsmydns.net) to check

2. **SSL Certificate Issues**:
   - Wait for automatic SSL provisioning
   - Check DNS records are correct

3. **CORS Issues**:
   - Verify CORS_ORIGIN in backend environment
   - Check frontend API URL configuration

4. **Deployment Failures**:
   - Check GitHub Actions logs
   - Verify all secrets are configured
   - Test locally first

### Debug Commands

```bash
# Check DNS propagation
nslookup your-domain.com

# Test SSL certificate
openssl s_client -connect your-domain.com:443

# Check deployment status
vercel ls
railway status

# View logs
vercel logs
railway logs
```

## Security Best Practices

1. **Rotate Tokens Regularly**:
   - Update tokens every 90 days
   - Use environment-specific tokens

2. **Monitor Access**:
   - Review deployment logs regularly
   - Set up alerts for failed deployments

3. **Backup Strategy**:
   - Regular database backups
   - Version control for all configurations

## Next Steps

After completing this setup:

1. **Performance Optimization**:
   - Enable CDN caching
   - Optimize images and assets
   - Monitor Core Web Vitals

2. **Monitoring Setup**:
   - Set up uptime monitoring
   - Configure error tracking
   - Enable performance monitoring

3. **SEO Optimization**:
   - Add meta tags
   - Configure sitemap
   - Set up Google Analytics

Your portfolio will be live at `https://your-domain.com` with a professional, production-ready setup! 🚀 