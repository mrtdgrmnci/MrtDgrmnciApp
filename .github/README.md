# GitHub Actions & CI/CD Setup

This directory contains the GitHub Actions workflows for automated testing, building, and deployment of the MRT Portfolio application.

## Workflows Overview

### 1. CI/CD Pipeline (`ci.yml`)
**Triggers:** Push to `main` or `mrtv2` branches, Pull Requests

**Jobs:**
- **Backend Tests**: Runs Jest tests with coverage reporting
- **Frontend Tests**: Runs Vitest tests with coverage reporting  
- **Linting**: Runs ESLint on both backend and frontend
- **Build**: Builds the frontend application
- **Security Scan**: Runs npm audit for vulnerability checks
- **Docker Build**: Builds Docker image for deployment
- **Quality Gate**: Final validation and summary

### 2. Production Deployment (`deploy.yml`)
**Triggers:** Push to `main` branch, Manual dispatch

**Jobs:**
- **Deploy to Production**: Full production deployment
- **Deploy to Staging**: Staging environment deployment
- **Rollback**: Manual rollback capability

### 3. Dependabot Auto-merge (`dependabot.yml`)
**Triggers:** Dependabot pull requests

**Features:**
- Auto-merge for patch updates
- Test validation for major/minor updates

## Required Secrets

### For CI/CD Pipeline
- `GITHUB_TOKEN` (automatically provided)

### For Production Deployment
- `VERCEL_TOKEN`: Vercel deployment token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID
- `RAILWAY_TOKEN`: Railway deployment token
- `RAILWAY_PROJECT_ID`: Railway project ID
- `RAILWAY_SERVICE`: Railway service name
- `SLACK_WEBHOOK_URL`: Slack notifications (optional)

## Setup Instructions

### 1. Enable GitHub Actions
1. Go to your repository settings
2. Navigate to "Actions" → "General"
3. Enable "Allow all actions and reusable workflows"

### 2. Configure Secrets
1. Go to repository settings → "Secrets and variables" → "Actions"
2. Add the required secrets listed above

### 3. Set up Dependabot
1. Go to repository settings → "Code security and analysis"
2. Enable "Dependency graph"
3. Enable "Dependabot alerts"
4. Enable "Dependabot security updates"

### 4. Configure Branch Protection
1. Go to repository settings → "Branches"
2. Add rule for `main` branch:
   - Require status checks to pass
   - Require branches to be up to date
   - Require pull request reviews
   - Include administrators

## Deployment Environments

### Production
- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: Railway PostgreSQL
- **Domain**: Custom domain with SSL

### Staging
- **Frontend**: Vercel Preview
- **Backend**: Railway Staging
- **Database**: Railway PostgreSQL (staging)

## Docker Configuration

### Production Build
```bash
# Build production image
docker build -t mrt-portfolio:latest .

# Run production container
docker run -p 5000:5000 mrt-portfolio:latest
```

### Development Setup
```bash
# Start development environment
docker-compose up

# Start with production profile
docker-compose --profile production up
```

## Monitoring & Health Checks

### Health Check Endpoints
- Frontend: `https://your-domain.vercel.app`
- Backend: `https://your-backend.railway.app/api/health`

### Monitoring Stack
- **Prometheus**: Metrics collection
- **Grafana**: Visualization (optional)
- **Slack**: Deployment notifications

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for linting errors

2. **Deployment Failures**
   - Verify all secrets are configured
   - Check service permissions
   - Review deployment logs

3. **Test Failures**
   - Run tests locally first
   - Check for environment-specific issues
   - Verify test data setup

### Debug Commands

```bash
# Run tests locally
npm test
cd frontend && npm run test:run

# Build locally
cd frontend && npm run build

# Docker build
docker build -t mrt-portfolio:test .

# Check logs
docker logs <container-name>
```

## Performance Optimization

### Build Optimization
- Multi-stage Docker builds
- Layer caching
- Dependency caching
- Parallel job execution

### Deployment Optimization
- Blue-green deployments
- Health checks
- Automatic rollbacks
- Load balancing

## Security Considerations

### Secrets Management
- Use GitHub Secrets for sensitive data
- Rotate tokens regularly
- Limit token permissions
- Use environment-specific secrets

### Security Scanning
- npm audit integration
- Dependency vulnerability checks
- Container security scanning
- Code security analysis

## Contributing

### Adding New Workflows
1. Create new workflow file in `.github/workflows/`
2. Follow naming conventions
3. Add appropriate triggers
4. Include proper error handling
5. Update this README

### Modifying Existing Workflows
1. Test changes locally first
2. Use workflow dispatch for testing
3. Update documentation
4. Notify team of changes

## Support

For issues with GitHub Actions:
1. Check workflow logs
2. Review error messages
3. Test locally
4. Create issue with detailed information

For deployment issues:
1. Check service logs
2. Verify configuration
3. Test endpoints
4. Contact service support 