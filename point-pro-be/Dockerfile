# Description: Dockerfile for production environment
FROM node:20-alpine
# Set metadata
LABEL description="dev environment for server" maintainer="Alan"
# Set working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy all files
COPY . ./
# Start the app
CMD ["npm", "run", "start"]