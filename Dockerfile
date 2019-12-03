FROM node:10-slim

COPY ./lib /action
ENTRYPOINT ["node" "/action/run.js"]
