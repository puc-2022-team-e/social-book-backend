# Build Layer
FROM node:16 as Builder

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install -g typescript

RUN npm install -g ts-node

RUN npm install

COPY --chown=node:node . .

USER node

RUN npm run build

RUN mv /home/node/app/dist /home/node/app/build

#App layer
FROM node:16.14

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install --production

COPY --from=builder /home/node/app/build ./build

ENV NODE_SERVER_PORT=8077

EXPOSE 8077

USER node

CMD [ "node", "build/server.js" ]