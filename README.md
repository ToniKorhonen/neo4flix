# 🎬 Neo4flix - Movie Recommendation Engine

> A modern, microservices-based movie recommendation engine using Neo4j graph database, Spring Boot, and Angular.

## ⚡ Quick Start

### Using Docker (Recommended - HTTPS Frontend)
```bash
# Generate SSL certificates (first time only)
bash scripts/init-certs.sh

# Start all services with HTTPS frontend
docker compose up -d

# Access the application
# Frontend:       https://localhost (HTTPS)
# API Gateway:    http://localhost:8080 (HTTP, internal only)
# Neo4j Browser:  http://localhost:7474 (neo4j/neo4jpassword)

# View logs
docker compose logs -f

# Stop everything
docker compose down
```

### Local Development (HTTPS)
```bash
# 1. Generate certificates (first time only)
bash scripts/init-certs.sh

# 2. In one terminal, start backend services
sudo ./scripts/start.sh

# 3. In another terminal, start Angular dev server with HTTPS
cd frontend
npm install
npm start
# Automatically launches on https://localhost:4200 with HTTPS
# Your browser will show a security warning for the self-signed cert - this is normal
```

### Alternative: HTTP Development (without HTTPS)
```bash
cd frontend
npm install
ng serve  # Plain HTTP on http://localhost:4200
```

## 🗄️ Neo4j Database

### MovieLens 100K Dataset

**⚠️ SETUP REQUIRED**: 
1. Download the dataset from [GroupLens](https://grouplens.org/datasets/movielens/100k/)
2. Extract to the `ml-100k/` directory
3. Generate the import file:
   ```bash
   node scripts/parse-movielens.js
   ```
   This creates `NEO4J_INIT.cypher` (105,556 Cypher statements for 943 users, 1,682 movies, 100,000 ratings, 19 genres)

**Dataset includes**: 943 users | 1,682 movies | 100,000 ratings | 19 genres

### Setup

#### Local Development
```bash
# 1. Start Neo4j
bash scripts/start-neo4j.sh

# 2. Import MovieLens 100K dataset
bash scripts/import-neo4j-local.sh

# 3. Access Neo4j Browser: http://localhost:7474
# Credentials: neo4j / neo4jpassword
```

#### Docker Deployment
```bash
# Start all services (including Neo4j with auto-import)
./scripts/start.sh

# Or manually:
docker compose up -d

# Access Neo4j: http://localhost:7474 (credentials: neo4j / neo4jpassword)
```

#### Stop & Cleanup
```bash
bash scripts/stop-neo4j.sh
```

### Graph Model

```
(User) --[RATED {rating, timestamp}]--> (Movie) --[HAS_GENRE]--> (Genre)
```


## 🏗️ Architecture

### Services
| Service | Port | Purpose |
|---------|------|---------|
| **Frontend** | 443 (HTTPS) | Angular web application |
| **API Gateway** | 8080 (HTTP) | Single entry point for all requests |
| **Film Service** | 8001 (HTTP) | Movie CRUD operations |
| **User Service** | 8002 (HTTP) | User profiles & management |
| **Rating Service** | 8003 (HTTP) | User ratings & reviews |
| **Recommendation Service** | 8004 (HTTP) | Personalized recommendations |
| **Auth Service** | 8005 (HTTP) | JWT authentication |

### Databases
- **Neo4j** (7687/7474) - Graph database for relationships
- **PostgreSQL** (5432) - Relational database for transactions

## 🔐 SSL/TLS Certificates

### Generate Certificates
```bash
# Self-signed certificates are auto-generated for local development
bash scripts/init-certs.sh

# This creates:
# - frontend/certs/cert.pem
# - frontend/certs/key.pem
# Valid for 365 days
```

**Note**: These are self-signed certificates. Your browser will show a security warning—this is normal for local development.

### Certificate Replacement
- For **production**: Replace `cert.pem` and `key.pem` with real certificates from Let's Encrypt or your CA
- For **local**: Regenerate with the init script if expired

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
