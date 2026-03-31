#!/bin/bash

# Script de démarrage de PostgreSQL uniquement pour le développement local

echo "🐘 Démarrage de PostgreSQL..."

# Arrêter et supprimer les conteneurs existants
docker stop postgres-db 2>/dev/null
docker rm postgres-db 2>/dev/null

# Démarrer PostgreSQL
docker run -d \
  --name postgres-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgrespassword \
  -e POSTGRES_DB=neo4flix \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine

echo "✅ PostgreSQL démarré sur localhost:5432"
echo "   Utilisateur: postgres"
echo "   Mot de passe: postgrespassword"
echo "   Base de données: neo4flix"

