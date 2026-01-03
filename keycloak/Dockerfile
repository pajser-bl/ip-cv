FROM quay.io/keycloak/keycloak:24.0.3 AS builder

WORKDIR /opt/keycloak

COPY realm-export.json /opt/keycloak/data/import/realm-export.json

RUN keytool -genkeypair \
    -storepass password \
    -storetype PKCS12 \
    -keyalg RSA \
    -keysize 2048 \
    -dname "CN=server" \
    -alias server \
    -ext "SAN:c=DNS:localhost,IP:127.0.0.1" \
    -keystore conf/server.keystore \
    && /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:24.0.3 AS runner

WORKDIR /opt/keycloak

COPY --from=builder /opt/keycloak/ /opt/keycloak/
COPY --from=builder /opt/keycloak/data/import/realm-export.json /opt/keycloak/data/import/

EXPOSE 8080

#ENTRYPOINT ["./bin/kc.sh", "start", "--optimized", "--import-realm"]
ENTRYPOINT ["./bin/kc.sh", "start", "--import-realm"]
