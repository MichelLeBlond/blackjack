# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the static files
RUN npm run build

# Stage 2: Create the final, smaller image
FROM node:20-alpine
WORKDIR /app

# Copy the server, package files, and the built static files from the builder stage
COPY --from=builder /app/server.js ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies for the server
RUN npm install --omit=dev

EXPOSE 8080
CMD ["npm", "start"]
