FROM node

WORKDIR /usr/src/app/authorization

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5006

CMD [ "node", "index.js" ]