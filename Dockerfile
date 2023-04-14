# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to /app
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents to /app
COPY . .

# Build the application
RUN npm run build

# Expose port 5500
EXPOSE 5500

# Start the application
CMD [ "npm", "start" ]

