# Multi-stage build for Recommendation Service
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build
COPY pom.xml .
COPY film-service/ ./film-service/
COPY api-gateway/ ./api-gateway/
COPY user-service/ ./user-service/
COPY rating-service/ ./rating-service/
COPY recommendation-service/ ./recommendation-service/
COPY auth-service/ ./auth-service/
RUN mvn clean package -pl recommendation-service -am -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /build/recommendation-service/target/recommendation-service-*.jar recommendation-service.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "recommendation-service.jar"]

