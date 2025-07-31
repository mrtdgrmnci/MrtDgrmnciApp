# MRT Portfolio Deployment Setup Script (PowerShell)
Write-Host "🚀 Setting up MRT Portfolio Deployment..." -ForegroundColor Blue

# Step 1: Install CLI tools
Write-Host "Step 1: Installing CLI tools..." -ForegroundColor Blue

Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
npm install -g vercel

Write-Host "Installing Railway CLI..." -ForegroundColor Yellow
npm install -g @railway/cli

Write-Host "✅ CLI tools installed successfully!" -ForegroundColor Green

# Step 2: Setup Vercel
Write-Host "Step 2: Setting up Vercel (Frontend)..." -ForegroundColor Blue
Write-Host "Please follow the prompts to login to Vercel..." -ForegroundColor Yellow

Set-Location frontend
vercel login

Write-Host "Linking project to Vercel..." -ForegroundColor Yellow
vercel link

Write-Host "✅ Vercel setup completed!" -ForegroundColor Green

# Step 3: Setup Railway
Write-Host "Step 3: Setting up Railway (Backend)..." -ForegroundColor Blue
Write-Host "Please follow the prompts to login to Railway..." -ForegroundColor Yellow

Set-Location ../backend
railway login

Write-Host "Initializing Railway project..." -ForegroundColor Yellow
railway init

Write-Host "✅ Railway setup completed!" -ForegroundColor Green

# Step 4: Get deployment information
Write-Host "Step 4: Getting deployment information..." -ForegroundColor Blue

Write-Host "Getting Vercel project information..." -ForegroundColor Yellow
Set-Location ../frontend
vercel project ls

Write-Host "Getting Railway project information..." -ForegroundColor Yellow
Set-Location ../backend
railway status

Write-Host "✅ Deployment information retrieved!" -ForegroundColor Green

# Step 5: Next steps
Write-Host "Step 5: Next steps..." -ForegroundColor Blue
Write-Host "1. Go to your GitHub repository" -ForegroundColor Yellow
Write-Host "2. Navigate to Settings → Secrets and variables → Actions" -ForegroundColor Yellow
Write-Host "3. Add the following secrets:" -ForegroundColor Yellow
Write-Host "   - VERCEL_TOKEN" -ForegroundColor Green
Write-Host "   - VERCEL_ORG_ID" -ForegroundColor Green
Write-Host "   - VERCEL_PROJECT_ID" -ForegroundColor Green
Write-Host "   - RAILWAY_TOKEN" -ForegroundColor Green
Write-Host "   - RAILWAY_PROJECT_ID" -ForegroundColor Green
Write-Host "   - RAILWAY_SERVICE" -ForegroundColor Green

Write-Host "4. Purchase a domain (if you don't have one)" -ForegroundColor Yellow
Write-Host "5. Configure DNS records as shown in DEPLOYMENT_SETUP.md" -ForegroundColor Yellow

Write-Host "🎉 Setup script completed!" -ForegroundColor Green
Write-Host "Check DEPLOYMENT_SETUP.md for detailed instructions." -ForegroundColor Blue 