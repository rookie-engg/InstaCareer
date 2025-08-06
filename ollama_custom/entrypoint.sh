#!/bin/sh

# Start the Ollama server in the background
ollama serve &

# Capture the process ID of the server
pid=$!

# Wait for the server to be up and running.
# We can check the health endpoint for a 200 OK response.
echo "Waiting for Ollama server to start..."
while ! curl -s -f http://localhost:11434/ > /dev/null; do
    sleep 1
done
echo "Ollama server started."

# Pull the model(s)
echo "Pulling gemma3:1b model..."
ollama pull gemma3:1b
echo "Model pull complete."

# Bring the server process to the foreground
wait $pid