# --- Stage 1: Build the React Frontend ---
# Use a Node.js image to build the React app.
# The build context for this Dockerfile should be the project root.
FROM node:18-alpine AS frontend
WORKDIR /app

# Copy package files and install dependencies first to leverage caching.
# ✅ CORRECTED: Paths are now relative to the project root.
COPY frontend/career-path/package*.json ./
RUN npm install

# Copy the rest of the frontend source code.
COPY frontend/career-path/ ./

# Build the frontend.
RUN npm run build

# --- Stage 2: Build the Spring Boot Backend ---
# Use a Maven image to build the Java application.
FROM maven:3.9-eclipse-temurin-17 AS backend
WORKDIR /app

# ✅ CORRECTED: Copy only the necessary source files and pom.xml.
# Copy the Maven project file.
COPY backend/i-career/pom.xml .
# Copy the backend source code.
COPY backend/i-career/src ./src

# ✅ CORRECTED: Copy the built frontend into the correct static resources directory.
COPY --from=frontend /app/build ./src/main/resources/static

# Build the JAR file, skipping tests for a faster production build.
RUN mvn clean package -DskipTests

# --- Stage 3: Create the Final Runtime Image ---
# Use a lightweight Java Runtime image for the final product.
FROM openjdk:17
WORKDIR /app

# Copy only the final executable JAR from the backend build stage.
COPY --from=backend /app/target/*.jar app.jar

# Expose the port the Spring Boot application runs on.
EXPOSE 8080

# The command to run the application when the container starts.
ENTRYPOINT ["java","-jar","app.jar"]
