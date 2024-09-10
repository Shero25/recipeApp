# Use the official Node.js image as the base image for building the Angular app
FROM node:16-alpine3.11 as angular

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Angular app for production
RUN npm run build

# Use the official Node.js image to serve the application
FROM httpd:alpine3.15

# Set the working directory
WORKDIR /usr/local/apache2/htdocs 

# Copy the built files from the build stage to the new working directory
COPY --from=angular /app/dist/recipe-app .

# Install a simple HTTP server to serve the static files
RUN npm install -g http-server

# Expose port 8080 (or any port of your choice)
EXPOSE 8080

# Start the HTTP server to serve the Angular app
CMD ["http-server", "-p", "8080", "dist/recipe-app"]
