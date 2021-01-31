FROM node:latest
WORKDIR /usr/src/messaging-service
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD [ "npm", "start" ]