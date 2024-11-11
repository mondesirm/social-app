FROM node:alpine
WORKDIR /usr/local/server
COPY package*.json ./
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]