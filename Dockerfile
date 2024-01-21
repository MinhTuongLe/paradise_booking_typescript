# user image contain Node.js and yarn
FROM node:18

# create app directory
WORKDIR /usr/src/lamheo4

# Copy all files to the workdir
COPY . /usr/src/lamheo4

# 
RUN npm install --legacy-peer-deps

RUN npm run build

# Command to run when starting the container
CMD ["npm", "start"]