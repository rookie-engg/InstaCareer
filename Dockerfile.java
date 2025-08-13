FROM node:18-alpine AS frontend
WORKDIR /app

COPY frontend/career-path/package*.json ./
RUN npm install

COPY frontend/career-path/ ./
RUN npm run build

FROM maven:3.9-eclipse-temurin-17 AS backend
WORKDIR /app

COPY backend/i-career/pom.xml .
COPY backend/i-career/src ./src
COPY --from=frontend /app/build ./src/main/resources/static
RUN mvn clean package -DskipTests

FROM openjdk:17
WORKDIR /app

COPY --from=backend /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
