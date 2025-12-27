# Dockerfile

# Stage 1: Build the application
FROM node:18-alpine AS build

# Install pnpm
RUN npm install -g pnpm

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Create the production image
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod

# Copy the built application from the build stage
COPY --from=build /usr/src/app/dist ./dist

# The application listens on port 3000 by default
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "run", "start:prod"]
