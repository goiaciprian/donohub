FROM node:23-slim

WORKDIR /client

COPY package*.json .
RUN npm ci

COPY . .
RUN npm ci

RUN npx nx run @donohub/client:build

EXPOSE 4300
ENTRYPOINT [ "npx", "nx", "run", "@donohub/client:serve" ]