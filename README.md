# 🎬 Neo4flix - Movie Recommendation Engine

> A modern, microservices-based movie recommendation engine using Neo4j graph database, Spring Boot, and Angular.

## ⚡ Quick Start

```bash
# Start all services
sudo ./scripts/start.sh

# Access the application
# Frontend:       http://localhost:4200
# API Gateway:    http://localhost:8080
# Neo4j Browser:  http://localhost:7474 (neo4j/neo4jpassword)
```

## 🏗️ Architecture

### Services
| Service | Port | Purpose |
|---------|------|---------|
| **Frontend** | 4200 | Angular web application |
| **API Gateway** | 8080 | Single entry point for all requests |
| **Film Service** | 8001 | Movie CRUD operations |
| **User Service** | 8002 | User profiles & management |
| **Rating Service** | 8003 | User ratings & reviews |
| **Recommendation Service** | 8004 | Personalized recommendations |
| **Auth Service** | 8005 | JWT authentication |

### Databases
- **Neo4j** (7687/7474) - Graph database for relationships
- **PostgreSQL** (5432) - Relational database for transactions

## 📋 Prerequisites

- Docker & Docker Compose
- Git

## 🚀 Getting Started

### 1. Clone & Setup
```bash
git clone <repo>
cd neo4flix
cp .env.example .env
```

### 2. Start Services
```bash
# Start everything
sudo ./scripts/start.sh

# View logs
docker compose logs -f

# Stop everything
sudo ./scripts/stop.sh
```

### 3. Initialize Data
Visit http://localhost:7474 and execute the script from `NEO4J_INIT.cypher`

## 📚 Documentation

- **Neo4j Model**: See `NEO4J_INIT.cypher`

## 🛠️ Development

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run -pl <service-name>
```

### Frontend
```bash
cd frontend
npm install
ng serve
# Visit http://localhost:4200
```

## 📊 Features

- ✅ User authentication (JWT)
- ✅ Movie search & filtering
- ✅ Rating system
- ✅ Personalized recommendations
- ✅ Microservices architecture
- ✅ Docker containerization
- ✅ Graph database relationships

## 🔐 Security

- JWT authentication on all endpoints
- Password hashing & validation
- PostgreSQL for sensitive data
- Network isolation with Docker

## 📝 Project Structure

```
neo4flix/
├── backend/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── film-service/
│   ├── user-service/
│   ├── rating-service/
│   ├── recommendation-service/
│   └── pom.xml
├── frontend/
│   ├── src/
│   ├── package.json
│   └── angular.json
├── scripts/
│   ├── start.sh
│   └── stop.sh
├── docker-compose.yml
└── NEO4J_INIT.cypher
```

## 🐳 Docker Commands

```bash
# Build images
docker compose build

# Start services
docker compose up -d

# Stop services (keep volumes)
docker compose down

# Stop & remove volumes
docker compose down -v

# View logs
docker compose logs -f <service>

# Remove orphaned containers
docker compose down --remove-orphans
```

## 📞 Useful Commands

```bash
# Check service health
docker compose ps

# View a service's logs
docker compose logs -f film-service

# Enter a container
docker exec -it film-service bash

# Neo4j Browser
open http://localhost:7474
```

## 📄 License

MIT License - See LICENSE file
