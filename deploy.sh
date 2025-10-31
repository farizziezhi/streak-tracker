#!/bin/bash

# Deploy script for VPS
echo "🚀 Deploying Streak Tracker..."

# Pull latest code
git pull origin main

# Install dependencies
npm install --production

# Run migrations
npm run migrate:prod

# Build application
npm run build

# Restart PM2 process
pm2 restart streak-tracker || pm2 start bin/server.js --name streak-tracker

echo "✅ Deployment completed!"