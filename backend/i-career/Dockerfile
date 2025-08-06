# --- Stage 1: Build the application ---
# Use a Maven image that includes the JDK to build the project
FROM maven:3.9.6-eclipse-temurin-17-focal AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven project file to leverage Docker's layer caching
COPY pom.xml .

# Copy the rest of the source code
COPY src ./src

# Build the project and create the JAR file, skipping tests for a faster build
RUN mvn clean package -DskipTests

# --- Stage 2: Create the final runtime image ---
# Use a slim JRE image for a smaller and more secure final image
FROM openjdk:17-jre-slim

# Set the working directory
WORKDIR /app

# Copy the executable JAR file from the 'build' stage
# The JAR name is determined from your pom.xml
COPY --from=build /app/target/i-career-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the application runs on (default is 8080)
EXPOSE 8080

# The command to run the application when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]