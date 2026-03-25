#!/bin/bash

# Neo4flix Cleanup Script
echo "🧹 Cleaning up Neo4flix Services..."

# Stop services
echo "🛑 Stopping services..."
docker compose down

# Remove volumes (optional)
read -p "Do you want to remove volumes (database data)? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removing volumes..."
    docker compose down -v
    echo "✅ Volumes removed"
fi

# Clean Maven artifacts (optional)
read -p "Do you want to clean Maven artifacts? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Cleaning Maven artifacts..."
    cd backend
    mvn clean
    cd ..
    echo "✅ Maven artifacts cleaned"
fi

echo "✅ Cleanup complete!"

