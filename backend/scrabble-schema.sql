CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE games (
    handle VARCHAR(8) PRIMARY KEY,
    player1 VARCHAR(25) NOT NULL,
    player1score INTEGER DEFAULT 0,
    player2 VARCHAR(25) DEFAULT "",
    player2score INTEGER DEFAULT 0
);