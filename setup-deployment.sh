#!/bin/bash

# MRT Portfolio Deployment Setup Script
echo "🚀 Setting up MRT Portfolio Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Installing CLI tools...${NC}"

# Install Vercel CLI
echo -e "${YELLOW}Installing Vercel CLI...${NC}"
npm install -g vercel

# Install Railway CLI
echo -e "${YELLOW}Installing Railway CLI...${NC}"
npm install -g @railway/cli

echo -e "${GREEN}✅ CLI tools installed successfully!${NC}"

echo -e "${BLUE}Step 2: Setting up Vercel (Frontend)...${NC}"
echo -e "${YELLOW}Please follow the prompts to login to Vercel...${NC}"
cd frontend
vercel login

echo -e "${YELLOW}Linking project to Vercel...${NC}"
vercel link

echo -e "${GREEN}✅ Vercel setup completed!${NC}"

echo -e "${BLUE}Step 3: Setting up Railway (Backend)...${NC}"
echo -e "${YELLOW}Please follow the prompts to login to Railway...${NC}"
cd ../backend
railway login

echo -e "${YELLOW}Initializing Railway project...${NC}"
railway init

echo -e "${GREEN}✅ Railway setup completed!${NC}"

echo -e "${BLUE}Step 4: Getting deployment information...${NC}"

# Get Vercel project info
echo -e "${YELLOW}Getting Vercel project information...${NC}"
cd ../frontend
vercel project ls

# Get Railway project info
echo -e "${YELLOW}Getting Railway project information...${NC}"
cd ../backend
railway status

echo -e "${GREEN}✅ Deployment information retrieved!${NC}"

echo -e "${BLUE}Step 5: Next steps...${NC}"
echo -e "${YELLOW}1. Go to your GitHub repository${NC}"
echo -e "${YELLOW}2. Navigate to Settings → Secrets and variables → Actions${NC}"
echo -e "${YELLOW}3. Add the following secrets:${NC}"
echo -e "${GREEN}   - VERCEL_TOKEN${NC}"
echo -e "${GREEN}   - VERCEL_ORG_ID${NC}"
echo -e "${GREEN}   - VERCEL_PROJECT_ID${NC}"
echo -e "${GREEN}   - RAILWAY_TOKEN${NC}"
echo -e "${GREEN}   - RAILWAY_PROJECT_ID${NC}"
echo -e "${GREEN}   - RAILWAY_SERVICE${NC}"

echo -e "${YELLOW}4. Purchase a domain (if you don't have one)${NC}"
echo -e "${YELLOW}5. Configure DNS records as shown in DEPLOYMENT_SETUP.md${NC}"

echo -e "${GREEN}🎉 Setup script completed!${NC}"
echo -e "${BLUE}Check DEPLOYMENT_SETUP.md for detailed instructions.${NC}" 