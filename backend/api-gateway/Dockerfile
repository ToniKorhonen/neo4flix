# Multi-stage build for API Gateway
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build
COPY pom.xml .
COPY film-service/ ./film-service/
COPY api-gateway/ ./api-gateway/
COPY user-service/ ./user-service/
COPY rating-service/ ./rating-service/
COPY recommendation-service/ ./recommendation-service/
COPY auth-service/ ./auth-service/
RUN mvn clean package -pl api-gateway -am -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /build/api-gateway/target/api-gateway-*.jar api-gateway.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "api-gateway.jar"]

