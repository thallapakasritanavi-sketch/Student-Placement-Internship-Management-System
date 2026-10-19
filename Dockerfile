# Multi-stage Docker build for Student Placement and Internship Management System
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /build

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build production JAR package
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /build/target/placement-system-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE 8080

# Run Spring Boot application, dynamically binding to $PORT and accepting JAVA_OPTS
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -Djava.security.egd=file:/dev/./urandom ${JAVA_OPTS} -jar app.jar"]
