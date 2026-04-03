#!/usr/bin/env node
/**
 * MovieLens 100K Dataset Parser
 * Converts ml-100k CSV files to Neo4j Cypher statements
 * 
 * Usage: node scripts/parse-movielens.js
 * Output: NEO4J_INIT.cypher (at project root)
 */
const fs = require('fs');
const path = require('path');
const ML_100K_DIR = path.join(__dirname, '../ml-100k');
const OUTPUT_FILE = path.join(__dirname, '../NEO4J_INIT.cypher');
console.log('🎬 MovieLens 100K → Neo4j Parser\n');
console.log('📁 Input:  ' + ML_100K_DIR);
console.log('📁 Output: ' + OUTPUT_FILE);
console.log('─'.repeat(60) + '\n');
const statements = [];
// ============ CONSTRAINTS & INDEXES ============
console.log('⚡ Creating constraints and indexes...');
statements.push(
  '// Neo4flix Data Model - Generated from MovieLens 100K Dataset',
  '// Generated on: ' + new Date().toISOString(),
  '// Total records: 943 users, 1682 movies, 100,000 ratings\n',
  '// Create constraints and indexes',
  'CREATE CONSTRAINT unique_user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;',
  'CREATE CONSTRAINT unique_movie_id IF NOT EXISTS FOR (m:Movie) REQUIRE m.id IS UNIQUE;',
  'CREATE CONSTRAINT unique_genre_id IF NOT EXISTS FOR (g:Genre) REQUIRE g.id IS UNIQUE;',
  'CREATE INDEX idx_user_age IF NOT EXISTS FOR (u:User) ON (u.age);',
  'CREATE INDEX idx_movie_title IF NOT EXISTS FOR (m:Movie) ON (m.title);',
  'CREATE INDEX idx_movie_year IF NOT EXISTS FOR (m:Movie) ON (m.year);',
  'CREATE INDEX idx_genre_name IF NOT EXISTS FOR (g:Genre) ON (g.name);',
  ''
);
// ============ PARSE GENRES ============
console.log('📖 Parsing genres from u.genre...');
const genreFile = path.join(ML_100K_DIR, 'u.genre');
const genreLines = fs.readFileSync(genreFile, 'utf-8').split('\n').filter(l => l.trim());
const genres = {};
genreLines.forEach(line => {
  const [name, id] = line.split('|');
  if (name && name !== 'unknown') {
    genres[id] = name;
    statements.push(`CREATE (g:Genre {id: toInteger(${id}), name: "${name.replace(/"/g, '\\"')}"});`);
  }
});
console.log(`   ✅ ${genreLines.length} genres parsed\n`);
statements.push('');
// ============ PARSE USERS ============
console.log('👥 Parsing users from u.user...');
const userFile = path.join(ML_100K_DIR, 'u.user');
const userLines = fs.readFileSync(userFile, 'utf-8').split('\n').filter(l => l.trim());
const occupations = new Set();
userLines.forEach(line => {
  const [id, age, gender, occupation, zipcode] = line.split('|');
  occupations.add(occupation);
  const stmt = `CREATE (u:User {id: toInteger(${id}), age: toInteger(${age}), gender: "${gender}", occupation: "${occupation.replace(/"/g, '\\"')}", zipcode: "${zipcode}"});`;
  statements.push(stmt);
});
console.log(`   ✅ ${userLines.length} users parsed\n`);
statements.push('');
// ============ PARSE MOVIES ============
console.log('🎥 Parsing movies from u.item...');
const movieFile = path.join(ML_100K_DIR, 'u.item');
const movieLines = fs.readFileSync(movieFile, 'utf-8').split('\n').filter(l => l.trim());
const movieGenreMap = {};
movieLines.forEach(line => {
  const parts = line.split('|');
  const id = parts[0];
  const title = parts[1].replace(/"/g, '\\"');
  const releaseDate = parts[2];
  // Extract genres from columns 5-23 (binary flags)
  const movieGenres = [];
  for (let i = 5; i < 24; i++) {
    if (parts[i] === '1') {
      const genreId = i - 5;
      if (genres[genreId]) {
        movieGenres.push(genreId);
      }
    }
  }
  movieGenreMap[id] = movieGenres;
  // Extract year from title (last 4 chars in parentheses)
  let year = 'null';
  const yearMatch = title.match(/\((\d{4})\)/);
  if (yearMatch) {
    year = yearMatch[1];
  }
  const stmt = `CREATE (m:Movie {id: toInteger(${id}), title: "${title}", releaseDate: "${releaseDate}", year: ${year}});`;
  statements.push(stmt);
});
console.log(`   ✅ ${movieLines.length} movies parsed\n`);
statements.push('');
// ============ CREATE MOVIE-GENRE RELATIONSHIPS ============
console.log('🔗 Creating Movie-Genre relationships...');
let relationshipCount = 0;
Object.entries(movieGenreMap).forEach(([movieId, genreIds]) => {
  genreIds.forEach(genreId => {
    statements.push(`MATCH (m:Movie {id: ${movieId}}), (g:Genre {id: ${genreId}}) CREATE (m)-[:HAS_GENRE]->(g);`);
    relationshipCount++;
  });
});
console.log(`   ✅ ${relationshipCount} Movie-Genre relationships created\n`);
statements.push('');
// ============ PARSE RATINGS ============
console.log('⭐ Parsing ratings from u.data...');
const ratingFile = path.join(ML_100K_DIR, 'u.data');
const ratingLines = fs.readFileSync(ratingFile, 'utf-8').split('\n').filter(l => l.trim());
ratingLines.forEach(line => {
  const [userId, movieId, rating, timestamp] = line.split('\t');
  const stmt = `MATCH (u:User {id: ${userId}}), (m:Movie {id: ${movieId}}) CREATE (u)-[:RATED {rating: toInteger(${rating}), timestamp: toInteger(${timestamp})}]->(m);`;
  statements.push(stmt);
});
console.log(`   ✅ ${ratingLines.length} ratings parsed\n`);
statements.push('');
// ============ VERIFICATION QUERIES ============
console.log('✔️  Adding verification queries...');
statements.push(
  '// Verification queries (uncomment to run)',
  '// MATCH (u:User) RETURN count(u) as UserCount;',
  '// MATCH (m:Movie) RETURN count(m) as MovieCount;',
  '// MATCH (g:Genre) RETURN count(g) as GenreCount;',
  '// MATCH (u:User)-[r:RATED]->(m:Movie) RETURN count(r) as RatingCount;'
);
// ============ WRITE OUTPUT ============
console.log('💾 Writing to file...');
const cypherContent = statements.join('\n');
fs.writeFileSync(OUTPUT_FILE, cypherContent, 'utf-8');
console.log('\n' + '='.repeat(60));
console.log('✨ SUCCESS!\n');
console.log('📊 Statistics:');
console.log(`   • Genres: ${genreLines.length}`);
console.log(`   • Users: ${userLines.length}`);
console.log(`   • Movies: ${movieLines.length}`);
console.log(`   • Ratings: ${ratingLines.length}`);
console.log(`   • Movie-Genre Relationships: ${relationshipCount}`);
console.log(`   • Total Cypher Statements: ${statements.length}\n`);
console.log('📁 Output: ' + OUTPUT_FILE);
console.log('═'.repeat(60) + '\n');
console.log('🚀 Next steps:');
console.log('   1. LOCAL DEV:');
console.log('      • Start Neo4j locally (docker run or Neo4j Desktop)');
console.log('      • Open Neo4j Browser (http://localhost:7474)');
console.log('      • Paste the content of NEO4J_INIT.cypher');
console.log('   2. DOCKER PROD:');
console.log('      • Run: docker compose up -d');
console.log('      • Data loads automatically on first start\n');
