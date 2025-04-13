FROM node:23-slim

WORKDIR /monorepo

COPY package*.json .
RUN npm install --foreground-scripts

COPY . .
RUN npm i

RUN npx nx run-many --target=build -all=true
