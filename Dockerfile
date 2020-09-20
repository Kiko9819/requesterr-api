FROM node:12.18.3-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm cache verify
RUN npm install
CMD ["npm", "run", "build"]
COPY ./build /usr/src/app
EXPOSE 3000
CMD ["npm", "start"]
