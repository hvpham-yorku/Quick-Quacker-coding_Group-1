CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ducks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(50) NOT NULL DEFAULT 'Mr. Quackers',
    level INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    xp_to_next_level INTEGER NOT NULL DEFAULT 100,
    mood VARCHAR(20) NOT NULL DEFAULT 'happy',
    feed_count INTEGER NOT NULL DEFAULT 0,
    water_count INTEGER NOT NULL DEFAULT 0,
    play_count INTEGER NOT NULL DEFAULT 0,
    last_interaction TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    duck_id INTEGER REFERENCES ducks(id),
    reached_level_2 BOOLEAN NOT NULL DEFAULT FALSE,
    fed_10_times BOOLEAN NOT NULL DEFAULT FALSE,
    watered_10_times BOOLEAN NOT NULL DEFAULT FALSE,
    played_with_duck_20_times BOOLEAN NOT NULL DEFAULT FALSE,
    reached_level_5 BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE rewards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    feed_count INTEGER NOT NULL DEFAULT 0,
    drink_count INTEGER NOT NULL DEFAULT 0
);
