#!/usr/bin/env bash
# Veil Deployment Script
# Usage: ./scripts/deploy.sh [environment]
#   environment: "production" (default) or "staging"

set -euo pipefail

ENV="${1:-production}"
COMPOSE_FILE="docker-compose.yml"

echo "🚀 Deploying Veil to ${ENV}..."

# Load environment-specific env file
if [ -f ".env.${ENV}" ]; then
  export $(grep -v '^#' ".env.${ENV}" | xargs)
elif [ -f ".env" ]; then
  export $(grep -v '^#' ".env" | xargs)
else
  echo "❌ No .env file found. Create .env or .env.${ENV}"
  exit 1
fi

# Build and start
echo "📦 Building containers..."
docker compose -f "${COMPOSE_FILE}" build --pull

echo "🔄 Starting services..."
docker compose -f "${COMPOSE_FILE}" up -d

echo "✅ Health check..."
sleep 5
curl -sSf http://localhost:3001/api/health || echo "⚠️  Health check failed — check logs"

echo "✅ Veil deployed successfully!"
echo "   API:      http://localhost:3001"
echo "   Frontend: http://localhost:80"