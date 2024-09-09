# Step 1: Use the official Node.js image as the base image for building the Angular app
FROM node:16-alpine AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the working directory
COPY . .

# Step 6: Build the Angular app for production
RUN npm run build --prod

# Step 7: Use the official Node.js image again to serve the application
FROM node:16-alpine

# Step 8: Set the working directory
WORKDIR /app

# Step 9: Copy the built files from the build stage to the new working directory
COPY --from=build /app/dist/recipe-app /app

# Step 10: Install a simple HTTP server to serve the static files
RUN npm install -g http-server

# Step 11: Expose port 8080 (or any port of your choice)
EXPOSE 8080

# Step 12: Start the HTTP server to serve the Angular app
CMD ["http-server", "-p", "8080", "dist/recipe-app"]