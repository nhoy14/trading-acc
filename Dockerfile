# Build Stage
FROM node:20-slim AS build

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the production assets
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Load default Nginx config (optional: customize for SPA support)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
