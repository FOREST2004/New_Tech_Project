#!/bin/bash
set -e

echo "🚀 Starting Thuan AI Service..."

# Start Ollama server in background
echo "📡 Starting Ollama server..."
ollama serve &
OLLAMA_PID=$!

# Function to check if Ollama is ready
check_ollama() {
    curl -s http://localhost:11434/api/tags > /dev/null 2>&1
}

# Wait for Ollama to be ready (max 60 seconds)
echo "⏳ Waiting for Ollama server to be ready..."
for i in {1..60}; do
    if check_ollama; then
        echo "✅ Ollama server is ready!"
        break
    fi
    echo "⏳ Attempt $i/60 - waiting..."
    sleep 1
done

# Check if Ollama is actually ready
if ! check_ollama; then
    echo "❌ Ollama server failed to start properly"
    exit 1
fi

# Pull the model
echo "📥 Pulling model: ${OLLAMA_MODEL}"
ollama pull "${OLLAMA_MODEL}" || echo "⚠️ Failed to pull model, continuing..."

# Start Node.js application on the port assigned by Heroku
echo "🟢 Starting Node.js AI Service on port ${PORT}..."
exec node server.js