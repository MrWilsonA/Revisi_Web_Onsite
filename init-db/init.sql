CREATE DATABASE ESkrim;

\c ESkrim;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    profile_picture TEXT
);

INSERT INTO users (username, password, email, role, profile_picture) 
VALUES ('admin', 'admin', 'admin@gmail.com', 'admin', '');
