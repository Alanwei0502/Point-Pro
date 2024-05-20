# Description: Dockerfile for production environment
FROM node:20-alpine
# Set metadata
LABEL description="dev environment for server" maintainer="Alan"
# Set working directory
WORKDIR /app
# Environment variables
ENV DEV=false
ENV VITE_API_HOST=https://point-pro-backend.onrender.com  
ENV VITE_MAPBOX_TOKEN=pk.eyJ1IjoiaHVhbjU2NzgiLCJhIjoiY2xnemhiaHJoMGp1ejNocGN5OXh1NTNsZyJ9.An3ZM8QfarnSBWhBqzV0YQ
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy all files
COPY . ./
# Start the app
CMD ["npm", "run", "start"]