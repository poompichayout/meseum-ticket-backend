FROM node:lts-buster
WORKDIR /usr/src
COPY . .
# NOTE: We don't copy the .env file. Please specify env vars at runtime
RUN npm ci
CMD [ "npm", "start" ]