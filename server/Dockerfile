FROM node:current-slim

WORKDIR /usr/src/app/
COPY . /usr/src/app

COPY package*.json ./
RUN npm install

EXPOSE 3000

CMD ["npm", "start", "cli" , "nodemon"]