-- Database initialization script for Camara application
-- This script will be executed when the PostgreSQL container starts

-- Create the main database if it doesn't exist
SELECT 'CREATE DATABASE camara_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'camara_db')\gexec

-- Create the test database if it doesn't exist
SELECT 'CREATE DATABASE camara_db_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'camara_db_test')\gexec

-- Connect to the main database
\c camara_db;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- You can add any initial data or additional setup here
