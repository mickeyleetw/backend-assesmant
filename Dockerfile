FROM node:20.11.0

ENV IS_TEST=false
COPY ./src /app/
COPY package*.json /app
COPY tsconfig.json /app
WORKDIR /app
RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]