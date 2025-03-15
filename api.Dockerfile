FROM node:23-alpine

ARG PORT=3001
ENV PORT=${PORT}

WORKDIR /api

COPY package*.json .
RUN npm ci

COPY . .
RUN npm ci

RUN npx nx run @donohub/api:build

EXPOSE ${PORT}
ENTRYPOINT [ "npx", "nx", "run", "@donohub/api:serve:production" ]