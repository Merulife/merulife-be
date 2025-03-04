#Use an official Node.js runtime as a base image with Node.js 18.x
FROM node:18-alpine

#create and set the working drectory in the container
WORKDIR /app

#copy package.json and package-lock.json(if available
COPY package*.json ./

# COPY .env ./

# Initialize dependencies
RUN npm install

#copy the prisma schema directory so that Prisma can find it
COPY prisma ./prisma

# generate the prisma client (this command now finds prisma/schema.prisma)
RUN npx prisma generate

#copy the rest of the application code
COPY . .

# Build your typescript code(ensure tsconfig.json outputs to the dist folder)
RUN npx tsc

#expose the port that your app will run on
EXPOSE 3000

#start the app using node
CMD [ "node", "dist/server.js" ]