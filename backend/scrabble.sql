\echo 'Delete and recreate scrabble db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE scrabble;
CREATE DATABASE scrabble;
\connect scrabble

\i scrabble-schema.sql

\echo 'Delete and recreate scrabble_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE scrabble_test;
CREATE DATABASE scrabble_test;
\connect scrabble_test

\i scrabble-schema.sql