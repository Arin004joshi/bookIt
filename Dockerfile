# --- Stage 1: Build the Frontend ---
# Use a Node.js image as the base for building
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# 👇 --- ADD THIS LINE ---
# Set NODE_ENV to development to ensure devDependencies (like autoprefixer)
# are installed for the build.
ENV NODE_ENV=development

# Copy package files and install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

RUN npm install postcss autoprefixer

# Copy the rest of the frontend source code and run the build
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Build the Backend ---
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

# 👇 --- ADD THIS LINE ---
# Also set NODE_ENV=development here for the backend build
ENV NODE_ENV=development

# Copy package files and install dependencies (including dev)
COPY backend/package.json backend/package-lock.json ./
RUN npm install

# Copy the rest of the backend source code and run the build
COPY backend/ ./
RUN npm run build

# --- Stage 3: Final Production Image ---
FROM node:20-alpine

WORKDIR /app

# Set to production environment for the final image
ENV NODE_ENV=production

# Copy backend package.json and install *only* production dependencies
COPY backend/package.json backend/package-lock.json ./
RUN npm install --omit=dev

# Copy the built backend JS files from the backend-builder stage
COPY --from=backend-builder /app/backend/dist ./dist

# Copy the built frontend static files from the frontend-builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose the port your server listens on
EXPOSE 5000

# The command to run your application
CMD ["node", "dist/index.js"]