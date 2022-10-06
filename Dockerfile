FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./

RUN npm install --only=dev

COPY src ./src

RUN npm run build

FROM node:18-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=prod

COPY --from=builder /usr/src/app/dist ./dist

COPY migrations ./migrations

CMD npm start
