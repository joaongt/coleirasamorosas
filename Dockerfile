FROM node:14

# set working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy app source code
COPY . .

# expose port
EXPOSE 8080

# start server
CMD [ "npm", "start" ]
