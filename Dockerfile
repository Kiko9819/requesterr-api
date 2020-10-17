FROM node:12.18.3-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./.env /usr/src/app
COPY package*.json /usr/src/app/
COPY ./src /usr/src/app/src
COPY ./tsconfig.json /usr/src/app

RUN npm cache verify \
    && npm install \
    && npm run build \
    && rm -rf src

EXPOSE 3000

CMD ["node", "./build/app.js"]
