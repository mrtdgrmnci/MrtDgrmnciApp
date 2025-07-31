# Deployment Setup Checklist

## ✅ Vercel Setup (Frontend)

- [x] **Vercel Token Obtained**: `GfamdbHNRGMPY0BnTmP0zvoy`
- [ ] **Project ID**: `_________________`
- [ ] **Org ID**: `_________________`
- [ ] **GitHub Secret Added**: `VERCEL_TOKEN`
- [ ] **GitHub Secret Added**: `VERCEL_ORG_ID`
- [ ] **GitHub Secret Added**: `VERCEL_PROJECT_ID`

## 🚂 Railway Setup (Backend)

- [ ] **Railway Token**: `_________________`
- [ ] **Project ID**: `_________________`
- [ ] **Service Name**: `_________________`
- [ ] **GitHub Secret Added**: `RAILWAY_TOKEN`
- [ ] **GitHub Secret Added**: `RAILWAY_PROJECT_ID`
- [ ] **GitHub Secret Added**: `RAILWAY_SERVICE`

## 🌐 Custom Domain Setup

- [ ] **Domain Purchased**: `_________________`
- [ ] **Vercel Domain Added**: `_________________`
- [ ] **Railway Domain Added**: `api._________________`
- [ ] **DNS Records Configured**:
  - [ ] A Record: `@` → `76.76.19.19`
  - [ ] CNAME Record: `www` → `cname.vercel-dns.com`
  - [ ] CNAME Record: `api` → `your-railway-app.railway.app`
- [ ] **SSL Certificates Active**
- [ ] **Environment Files Updated**:
  - [ ] `frontend/.env.production`
  - [ ] `backend/.env.production`

## 🧪 Testing

- [ ] **Frontend Manual Deploy**: `vercel --prod`
- [ ] **Backend Manual Deploy**: `railway up`
- [ ] **GitHub Actions Triggered**
- [ ] **Health Checks Pass**:
  - [ ] Frontend: `https://your-domain.com`
  - [ ] Backend: `https://api.your-domain.com/api/health`
- [ ] **Functionality Tests**:
  - [ ] Home page loads
  - [ ] Projects page works
  - [ ] Blog posts accessible
  - [ ] Contact form functional
  - [ ] Admin login works

## 🔧 GitHub Actions

- [ ] **CI/CD Pipeline Working**
- [ ] **Deployment Pipeline Working**
- [ ] **Dependabot Enabled**
- [ ] **Branch Protection Configured**

## 📊 Monitoring

- [ ] **Uptime Monitoring Setup**
- [ ] **Error Tracking Configured**
- [ ] **Performance Monitoring Active**

## 🎯 Final Status

- [ ] **Production Deployment Live**
- [ ] **Custom Domain Active**
- [ ] **SSL Certificates Valid**
- [ ] **All Tests Passing**
- [ ] **Portfolio Accessible at**: `https://your-domain.com`

---

## 📝 Notes

### Vercel Information Needed:
- Project ID (from `vercel project ls` or dashboard)
- Org ID (from dashboard settings)

### Railway Information Needed:
- Railway token (create in dashboard)
- Project ID (from `railway status`)
- Service name (usually "backend" or project name)

### Domain Suggestions:
- `mrtdgrmnci.com`
- `mrt-portfolio.com`
- `mrt.dev`
- `mrtdgrmnci.dev`

### Quick Commands:
```bash
# Get Vercel info
cd frontend && vercel project ls

# Get Railway info
cd backend && railway status

# Test deployments
cd frontend && vercel --prod
cd backend && railway up
``` 