// Neo4flix Data Model Initialization Script
// Run this in Neo4j Browser to set up the initial data structure

// Create constraints and indexes
CREATE CONSTRAINT unique_user_email IF NOT EXISTS
FOR (u:User) REQUIRE u.email IS UNIQUE;

CREATE CONSTRAINT unique_user_username IF NOT EXISTS
FOR (u:User) REQUIRE u.username IS UNIQUE;

CREATE CONSTRAINT unique_film_id IF NOT EXISTS
FOR (f:Film) REQUIRE f.id IS UNIQUE;

CREATE INDEX idx_film_title IF NOT EXISTS
FOR (f:Film) ON (f.title);

CREATE INDEX idx_film_year IF NOT EXISTS
FOR (f:Film) ON (f.year);

CREATE INDEX idx_genre_name IF NOT EXISTS
FOR (g:Genre) ON (g.name);

CREATE INDEX idx_rating_created IF NOT EXISTS
FOR (r:Rating) ON (r.createdAt);

// Sample Users
CREATE (u1:User {
  id: 'user-1',
  username: 'john_doe',
  email: 'john@example.com',
  createdAt: datetime.now(),
  updatedAt: datetime.now()
})
RETURN u1;

CREATE (u2:User {
  id: 'user-2',
  username: 'jane_smith',
  email: 'jane@example.com',
  createdAt: datetime.now(),
  updatedAt: datetime.now()
})
RETURN u2;

// Sample Genres
CREATE (g1:Genre { name: 'Action', description: 'Action-packed films' })
CREATE (g2:Genre { name: 'Drama', description: 'Dramatic storytelling' })
CREATE (g3:Genre { name: 'Comedy', description: 'Humorous films' })
CREATE (g4:Genre { name: 'Sci-Fi', description: 'Science Fiction' })
CREATE (g5:Genre { name: 'Romance', description: 'Love stories' })
RETURN g1, g2, g3, g4, g5;

// Sample Films
CREATE (f1:Film {
  id: 'film-1',
  title: 'Inception',
  year: 2010,
  director: 'Christopher Nolan',
  description: 'A thief who steals corporate secrets through dream-sharing technology',
  rating: 8.8,
  createdAt: datetime.now()
})
CREATE (f2:Film {
  id: 'film-2',
  title: 'The Shawshank Redemption',
  year: 1994,
  director: 'Frank Darabont',
  description: 'Two imprisoned men bond over a number of years',
  rating: 9.3,
  createdAt: datetime.now()
})
CREATE (f3:Film {
  id: 'film-3',
  title: 'Forrest Gump',
  year: 1994,
  director: 'Robert Zemeckis',
  description: 'The life of a simple man and his extraordinary journey',
  rating: 8.8,
  createdAt: datetime.now()
})
CREATE (f4:Film {
  id: 'film-4',
  title: 'The Dark Knight',
  year: 2008,
  director: 'Christopher Nolan',
  description: 'Batman faces the Joker, a criminal mastermind',
  rating: 9.0,
  createdAt: datetime.now()
})
RETURN f1, f2, f3, f4;

// Link Films to Genres
MATCH (f:Film { title: 'Inception' })
MATCH (g:Genre { name: 'Sci-Fi' })
CREATE (f)-[:HAS_GENRE]->(g);

MATCH (f:Film { title: 'Inception' })
MATCH (g:Genre { name: 'Action' })
CREATE (f)-[:HAS_GENRE]->(g);

MATCH (f:Film { title: 'The Shawshank Redemption' })
MATCH (g:Genre { name: 'Drama' })
CREATE (f)-[:HAS_GENRE]->(g);

MATCH (f:Film { title: 'Forrest Gump' })
MATCH (g:Genre { name: 'Drama' })
CREATE (f)-[:HAS_GENRE]->(g);

MATCH (f:Film { title: 'Forrest Gump' })
MATCH (g:Genre { name: 'Romance' })
CREATE (f)-[:HAS_GENRE]->(g);

MATCH (f:Film { title: 'The Dark Knight' })
MATCH (g:Genre { name: 'Action' })
CREATE (f)-[:HAS_GENRE]->(g);

MATCH (f:Film { title: 'The Dark Knight' })
MATCH (g:Genre { name: 'Drama' })
CREATE (f)-[:HAS_GENRE]->(g);

// Sample Ratings
MATCH (u:User { username: 'john_doe' })
MATCH (f:Film { title: 'Inception' })
CREATE (u)-[:RATED {
  score: 9,
  review: 'Mind-bending masterpiece!',
  createdAt: datetime.now()
}]->(f);

MATCH (u:User { username: 'john_doe' })
MATCH (f:Film { title: 'The Shawshank Redemption' })
CREATE (u)-[:RATED {
  score: 10,
  review: 'Perfect film!',
  createdAt: datetime.now()
}]->(f);

MATCH (u:User { username: 'jane_smith' })
MATCH (f:Film { title: 'Forrest Gump' })
CREATE (u)-[:RATED {
  score: 8,
  review: 'A beautiful journey',
  createdAt: datetime.now()
}]->(f);

MATCH (u:User { username: 'jane_smith' })
MATCH (f:Film { title: 'The Dark Knight' })
CREATE (u)-[:RATED {
  score: 9,
  review: 'Brilliant superhero film',
  createdAt: datetime.now()
}]->(f);

// Verify data
MATCH (u:User) RETURN count(u) as UserCount;
MATCH (f:Film) RETURN count(f) as FilmCount;
MATCH (g:Genre) RETURN count(g) as GenreCount;
MATCH (u:User)-[r:RATED]->(f:Film) RETURN count(r) as RatingCount;

