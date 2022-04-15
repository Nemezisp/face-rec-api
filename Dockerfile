FROM node:16.14.2

WORKDIR /usr/src/smart-brain-api

COPY ./ ./

RUN npm install