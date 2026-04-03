#!/bin/bash

# 🎬 Script de démarrage de Neo4j pour développement local

echo "🎬 Démarrage de Neo4j..."

# Vérifier si Docker est en cours d'exécution
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker n'est pas en cours d'exécution. Veuillez démarrer Docker et réessayer."
    exit 1
fi

# Arrêter et supprimer les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker stop neo4j-db 2>/dev/null || true
docker rm neo4j-db 2>/dev/null || true

# Démarrer Neo4j
echo "▶️  Démarrage du conteneur Neo4j..."
docker run -d \
  --name neo4j-db \
  -e NEO4J_AUTH=neo4j/neo4jpassword \
  -e NEO4J_PLUGINS='["graph-data-science"]' \
  -p 7474:7474 \
  -p 7687:7687 \
  -v neo4j_data:/var/lib/neo4j/data \
  -v neo4j_logs:/var/lib/neo4j/logs \
  neo4j:5.15

echo "⏳ Attente du démarrage de Neo4j..."
sleep 5

# Vérifier la santé du conteneur
RETRIES=0
MAX_RETRIES=30
while [ $RETRIES -lt $MAX_RETRIES ]; do
    if docker exec neo4j-db cypher-shell -u neo4j -p neo4jpassword "RETURN 1" > /dev/null 2>&1; then
        echo "✅ Neo4j démarré avec succès!"
        break
    fi
    RETRIES=$((RETRIES + 1))
    if [ $RETRIES -lt $MAX_RETRIES ]; then
        echo "⏳ Tentative $RETRIES/$MAX_RETRIES..."
        sleep 2
    fi
done

if [ $RETRIES -eq $MAX_RETRIES ]; then
    echo "❌ Neo4j n'a pas démarré à temps."
    exit 1
fi

echo ""
echo "✅ Neo4j est maintenant en cours d'exécution!"
echo ""
echo "📊 Accès:"
echo "   Neo4j Browser: http://localhost:7474"
echo "   Utilisateur: neo4j"
echo "   Mot de passe: neo4jpassword"
echo "   Bolt: bolt://localhost:7687"
echo ""
echo "📥 Pour importer les données MovieLens:"
echo "   ./scripts/import-neo4j-local.sh"
echo ""

