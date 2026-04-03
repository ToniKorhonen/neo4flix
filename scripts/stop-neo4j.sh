#!/bin/bash

# 🛑 Script d'arrêt de Neo4j et nettoyage des données

echo "🛑 Arrêt de Neo4j..."

# Vérifier si Docker est en cours d'exécution
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker n'est pas en cours d'exécution."
    exit 1
fi

# Vérifier si le conteneur existe
if ! docker ps -a --format '{{.Names}}' | grep -q '^neo4j-db$'; then
    echo "⚠️  Le conteneur neo4j-db n'existe pas."
    exit 0
fi

# Arrêter le conteneur
echo "⏹️  Arrêt du conteneur Neo4j..."
docker stop neo4j-db 2>/dev/null || true

echo "🗑️  Suppression du conteneur..."
docker rm neo4j-db

echo ""
echo "✅ Conteneur Neo4j arrêté et supprimé."
echo ""

# Demander si l'utilisateur veut vider les données
echo "❓ Voulez-vous vider les données Neo4j (volume neo4j_data)?"
echo "   ⚠️  Cette action est IRRÉVERSIBLE!"
echo ""
read -p "Taper 'oui' pour confirmer ou appuyer sur Entrée pour annuler: " confirm

if [ "$confirm" = "oui" ]; then
    echo ""
    echo "🗑️  Suppression des données Neo4j..."
    docker volume rm neo4j_data 2>/dev/null && echo "✅ Volume neo4j_data supprimé." || echo "⚠️  Volume neo4j_data non trouvé ou déjà supprimé."
    docker volume rm neo4j_logs 2>/dev/null && echo "✅ Volume neo4j_logs supprimé." || echo "⚠️  Volume neo4j_logs non trouvé ou déjà supprimé."
    echo ""
    echo "🔄 Les données ont été complètement supprimées."
else
    echo ""
    echo "✅ Les données ont été conservées."
fi

echo ""
echo "💡 Pour relancer Neo4j:"
echo "   ./scripts/start-neo4j.sh"
echo ""

