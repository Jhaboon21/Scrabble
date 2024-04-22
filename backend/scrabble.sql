\echo 'Delete and recreate scrabble db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE scrabble;
CREATE DATABASE scrabble;
\connect scrabble

\i scrabble-schema.sql