#!/bin/sh
# Creates the database with two roles instead of letting the app use the superuser:
#   cashflow_owner  owns the schema, used only for migrations
#   cashflow_app    runtime role of the backend, data access only (no CREATE, no DROP)
set -eu

: "${CASHFLOW_DB:?}" "${CASHFLOW_OWNER_PASSWORD:?}" "${CASHFLOW_APP_PASSWORD:?}"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres \
    -v db="$CASHFLOW_DB" \
    -v owner_password="$CASHFLOW_OWNER_PASSWORD" \
    -v app_password="$CASHFLOW_APP_PASSWORD" <<'SQL'
CREATE ROLE cashflow_owner LOGIN PASSWORD :'owner_password';
CREATE ROLE cashflow_app LOGIN PASSWORD :'app_password';
CREATE DATABASE :"db" OWNER cashflow_owner;
REVOKE ALL ON DATABASE :"db" FROM PUBLIC;
GRANT CONNECT, TEMPORARY ON DATABASE :"db" TO cashflow_app;

\connect :"db"
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO cashflow_app;
ALTER DEFAULT PRIVILEGES FOR ROLE cashflow_owner IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO cashflow_app;
ALTER DEFAULT PRIVILEGES FOR ROLE cashflow_owner IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO cashflow_app;
SQL
