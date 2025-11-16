# Stage 1: Build React Client
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build

# Stage 2: Prepare Node.js Server
FROM node:18-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./

# Stage 3: Final Image with Nginx + Node.js
FROM nginx:alpine

# Install Node.js and Supervisor
RUN apk add --no-cache nodejs npm supervisor

# Copy Nginx configuration
COPY nginx.prod.conf /etc/nginx/nginx.conf

# Copy React build to Nginx
COPY --from=client-build /app/client/build /usr/share/nginx/html

# Copy Node.js server
COPY --from=server-build /app/server /app/server

# Copy Supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create logs directory
RUN mkdir -p /var/log/supervisor /app/server/logs

# Expose port 80
EXPOSE 80

# Start Supervisor (manages both Node.js and Nginx)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
