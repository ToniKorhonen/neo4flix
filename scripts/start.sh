#!/bin/bash

# Neo4flix Startup Script
echo "🚀 Starting Neo4flix Services..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration values"
fi

# Build and start services
echo "🔨 Building Docker images..."
docker compose build

echo "🎯 Starting services..."
docker compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check health
echo "🏥 Checking service health..."
docker compose ps

echo ""
echo "✅ Neo4flix is running!"
echo ""
echo "📊 Dashboard URLs:"
echo "   Frontend: http://localhost:4200"
echo "   API Gateway: http://localhost:8080"
echo "   Neo4j Browser: http://localhost:7474 (neo4j/neo4jpassword)"
echo "   Film Service: http://localhost:8001"
echo "   User Service: http://localhost:8002"
echo "   Rating Service: http://localhost:8003"
echo "   Recommendation Service: http://localhost:8004"
echo "   Auth Service: http://localhost:8005"
echo ""
echo "💡 Useful commands:"
echo "   docker compose logs -f                 # View logs"
echo "   docker compose down                    # Stop services"
echo "   docker compose down -v                 # Stop and remove volumes"
echo ""

