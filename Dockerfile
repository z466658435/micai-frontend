FROM node:18.12-slim

WORKDIR /usr/src/app/frontend

COPY . .

COPY build/ /usr/src/app/frontend

#RUN npm install -g cnpm --registry=https://registry.npm.taobao.org 

RUN npm install -ci


CMD ["npm", "start"]