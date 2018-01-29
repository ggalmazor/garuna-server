#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER garuna WITH PASSWORD 'garuna';
    CREATE DATABASE consulta WITH OWNER garuna;
    GRANT ALL PRIVILEGES ON DATABASE consulta TO garuna;
    \connect consulta;
    CREATE SCHEMA consulta;
    GRANT ALL PRIVILEGES ON SCHEMA consulta TO garuna;
EOSQL