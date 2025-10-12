FROM ollama/ollama:latest

# Install Node.js
RUN apt-get update && apt-get install -y \
    curl \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Create startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port
EXPOSE $PORT

# Start the service
CMD ["/start.sh"]