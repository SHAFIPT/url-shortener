# Use official Node.js image as base
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Create a non-root user for better security
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001
RUN chown -R appuser:nodejs /app
USER appuser

# Expose backend port
EXPOSE 5000

# Start the backend server in dev mode
CMD ["npm", "run", "dev"]
