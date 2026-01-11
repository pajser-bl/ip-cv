############################
# Stage 1 - Build
############################
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

COPY gradlew ./
COPY gradle ./gradle
COPY build.gradle .
COPY settings.gradle .
COPY gradle.properties .

RUN chmod +x ./gradlew && ./gradlew --no-daemon build -x test

COPY . .

RUN ./gradlew clean build -x test --no-daemon

############################
# Stage 2 - Run
############################
FROM eclipse-temurin:21-jdk-alpine AS runner
WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

