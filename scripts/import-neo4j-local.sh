#!/bin/bash
# 🎬 Neo4j Local Import Helper
# This script helps import MovieLens data into a local Neo4j instance
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CYPHER_FILE="$PROJECT_ROOT/NEO4J_INIT.cypher"
NEO4J_HOST="${NEO4J_HOST:-localhost}"
NEO4J_PORT="${NEO4J_PORT:-7687}"
NEO4J_USER="${NEO4J_USER:-neo4j}"
NEO4J_PASSWORD="${NEO4J_PASSWORD:-neo4jpassword}"
echo "🎬 Neo4j Local Import Helper"
echo "═══════════════════════════════════════"
# Check if Cypher file exists
if [ ! -f "$CYPHER_FILE" ]; then
    echo "❌ Cypher file not found: $CYPHER_FILE"
    echo ""
    echo "Generating from MovieLens dataset..."
    node "$SCRIPT_DIR/parse-movielens.js"
fi
echo "✅ Cypher file ready: $CYPHER_FILE"
echo ""
# Check if cypher-shell is available
if ! command -v cypher-shell &> /dev/null; then
    echo "⚠️  cypher-shell not found in PATH"
    echo ""
    echo "Options:"
    echo "1. Install Neo4j locally from https://neo4j.com/download/"
    echo "2. Use Neo4j Browser (manual copy-paste):"
    echo "   - Visit: http://$NEO4J_HOST:7474"
    echo "   - Username: $NEO4J_USER"
    echo "   - Password: $NEO4J_PASSWORD"
    echo "   - Copy content from: $CYPHER_FILE"
    echo "   - Paste into browser and run"
    echo ""
    exit 1
fi
# Check connection
echo "🔌 Testing Neo4j connection..."
if ! cypher-shell -a bolt://$NEO4J_HOST:$NEO4J_PORT -u $NEO4J_USER -p $NEO4J_PASSWORD "RETURN 1" > /dev/null 2>&1; then
    echo "❌ Cannot connect to Neo4j at $NEO4J_HOST:$NEO4J_PORT"
    echo ""
    echo "Start Neo4j with:"
    echo "  docker run -d --name neo4j -p 7687:7687 -p 7474:7474 \\"
    echo "    -e NEO4J_AUTH=neo4j/neo4jpassword \\"
    echo "    neo4j:5.15"
    echo ""
    exit 1
fi
echo "✅ Connected to Neo4j"
echo ""
# Import data
echo "📥 Importing MovieLens 100K dataset..."
echo "   This may take 2-3 minutes..."
echo ""
cypher-shell \
    -a bolt://$NEO4J_HOST:$NEO4J_PORT \
    -u $NEO4J_USER \
    -p $NEO4J_PASSWORD \
    < "$CYPHER_FILE"
echo ""
echo "✅ Import complete!"
echo ""
# Show stats
echo "📊 Verifying import..."
{
    timeout 30 cypher-shell \
        -a bolt://$NEO4J_HOST:$NEO4J_PORT \
        -u $NEO4J_USER \
        -p $NEO4J_PASSWORD <<EOF
MATCH (u:User) RETURN count(u) as users;
MATCH (m:Movie) RETURN count(m) as movies;
MATCH (g:Genre) RETURN count(g) as genres;
MATCH ()-[r:RATED]->() RETURN count(r) as ratings;
EOF
} || true

echo ""
echo "🎉 All done!"
echo ""
echo "Access Neo4j Browser: http://$NEO4J_HOST:7474"
echo ""
