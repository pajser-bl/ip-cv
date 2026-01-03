FROM node:22-bookworm AS builder

WORKDIR /app

COPY package*.json package-lock.json ./

RUN npm install && \
    npm install -g @angular/cli

COPY . .

RUN sed -i 's|\${KEYCLOAK_URL}|'${KEYCLOAK_URL}'|g' src/environments/environment.prod.ts \
    && sed -i 's|\${KEYCLOAK_REALM}|'${KEYCLOAK_REALM}'|g' src/environments/environment.prod.ts \
    && sed -i 's|\${KEYCLOAK_CLIENT_ID}|'${KEYCLOAK_CLIENT_ID}'|g' src/environments/environment.prod.ts

RUN ng build --configuration=production

FROM nginx:latest AS runner

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist/backoffice/browser /usr/share/nginx/html

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80


