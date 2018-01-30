#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER garuna WITH PASSWORD 'garuna';
    CREATE DATABASE consulta;
    \connect consulta;
    CREATE EXTENSION pgcrypto;
    CREATE SCHEMA consulta;
    ALTER DATABASE consulta OWNER TO garuna;
    ALTER SCHEMA consulta OWNER TO garuna;
EOSQL