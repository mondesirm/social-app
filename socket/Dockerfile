FROM node:alpine
WORKDIR /usr/local/socket
COPY package*.json ./
RUN npm install
EXPOSE 9000
CMD ["npm", "start"]