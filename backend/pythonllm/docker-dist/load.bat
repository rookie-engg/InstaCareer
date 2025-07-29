@echo off
setlocal

REM === Function to check if image exists ===
REM We use 'docker image inspect' to check for image existence

echo Checking if image mongo:latest exists...
docker image inspect mongo:latest >nul 2>&1
IF ERRORLEVEL 1 (
    echo Image mongo:latest not found. Loading from file...
    docker image load -i images/mongo_latest.docker.img
    IF ERRORLEVEL 1 (
        echo Failed to load mongo.docker.img
        exit /b 1
    )
) ELSE (
    echo Image mongo:latest already exists. Skipping load.
)

echo Checking if image ollama:latest exists...
docker image inspect ollama/ollama:latest >nul 2>&1
IF ERRORLEVEL 1 (
    echo Image ollama/ollama:latest not found. Loading from file...
    docker image load -i images/ollama_ollama_latest.docker.img
    IF ERRORLEVEL 1 (
        echo Failed to load ollama.docker.img
        exit /b 1
    )
) ELSE (
    echo Image pllama/ollama:latest already exists. Skipping load.
)

echo Checking if image socket-server:latest exists...
docker image inspect socket-server:latest >nul 2>&1
IF ERRORLEVEL 1 (
    echo Image socket-server:latest not found. Loading from file...
    docker image load -i images/socket-server_latest.docker.img
    IF ERRORLEVEL 1 (
        echo Failed to load socket-server.docker.img
        exit /b 1
    )
) ELSE (
    echo Image socket-server:latest already exists. Skipping load.
)

REM === Start Docker Compose ===
echo Starting docker-compose...
docker compose up
IF ERRORLEVEL 1 (
    echo docker-compose failed to start
    exit /b 1
)