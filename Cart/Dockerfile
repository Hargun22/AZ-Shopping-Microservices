FROM node

WORKDIR /usr/src/app/cart

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5005

CMD [ "node", "index.js" ]