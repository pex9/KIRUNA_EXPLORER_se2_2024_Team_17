# Use official Node.js image from Docker Hub
FROM node:23

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire server application
COPY . .

# Expose the port that the server will run on
EXPOSE 3001

# Command to run your application
CMD ["npm", "start"]
