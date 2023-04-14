# Use an official Node.js runtime as a parent image
FROM node:lts

# Set the working directory to /projetao
WORKDIR /projetao

# Copy package.json and package-lock.json to /projetao
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents to /projetao
COPY . .

# Build the application
RUN npm run build

# Expose port 5500
EXPOSE 5500

# Start the application
CMD [ "npm", "start" ]

