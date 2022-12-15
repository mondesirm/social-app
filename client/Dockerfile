FROM node:alpine
WORKDIR /usr/local/client
COPY package*.json ./
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]