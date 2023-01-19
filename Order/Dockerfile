FROM node

WORKDIR /usr/src/app/order

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5004

CMD [ "node", "index.js" ]