# Multi-stage Docker build for Student Placement and Internship Management System
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Install Maven and package the application
RUN apt-get update && apt-get install -y maven && mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /app/target/placement-system-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE 8080

# Run with in-memory H2 database by default (can be overridden with -Dspring.profiles.active=mysql)
ENTRYPOINT ["java", "-Dspring.profiles.active=h2", "-jar", "app.jar"]
