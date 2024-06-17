#!/bin/bash

set -e

echo "Starting CI/CD script..."

# 1. Tests End-to-End (décommenter si nécessaire)
# echo "Running end-to-end tests..."
# npm install
# npm run test:e2e

# 2. Déploiement
echo "Deploying services with Docker Compose..."
docker-compose down --remove-orphans

# Suppression des anciennes images pour forcer la reconstruction
docker-compose rm -f
docker rmi $(docker images -q) || true

# Reconstruction des images
echo "Building Docker images..."
docker-compose build --no-cache

# Démarrage des services
echo "Starting Docker Compose services..."
docker-compose up -d

# Attendre que les services soient lancés
echo "Waiting for services to be ready..."
sleep 30

# 3. Tests des API déployées

echo "Running tests for Product API..."
docker-compose exec product npm install
docker-compose exec product npm test

echo "Running tests for Customer API..."
docker-compose exec customer npm install
docker-compose exec customer npm test

echo "Running tests for Order API..."
docker-compose exec order npm install
docker-compose exec order npm test

# Nettoyer les services après les tests
echo "Tearing down Docker Compose services..."
docker-compose down

echo "CI/CD script completed."
