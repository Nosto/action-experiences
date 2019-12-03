FROM node:10-slim

COPY ./lib /action
RUN cd /action && npm install
ENTRYPOINT ["node", "/action/run.js"]
