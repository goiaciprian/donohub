FROM node:23-slim

ARG PORT=4300
ENV PORT=${PORT}

WORKDIR /client

COPY package*.json .
RUN npm ci

COPY . .

RUN npx nx run @donohub/client:build

EXPOSE ${PORT}
ENTRYPOINT [ "npx", "nx", "run", "@donohub/client:serve" ]