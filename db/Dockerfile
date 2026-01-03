FROM postgres:17.2-bookworm

COPY keycloak.sql /docker-entrypoint-initdb.d/
COPY init.sql /docker-entrypoint-initdb.d/
COPY seed.sql /docker-entrypoint-initdb.d/

