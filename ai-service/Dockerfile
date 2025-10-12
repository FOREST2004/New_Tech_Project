FROM node:18-slim

WORKDIR /app

# Copy và install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy source code
COPY server.js ./

# Expose port
EXPOSE $PORT

# Start app
CMD ["node", "server.js"]
