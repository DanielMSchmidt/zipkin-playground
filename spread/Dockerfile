FROM node:9-slim
WORKDIR /usr/src/app
EXPOSE 4000

COPY package*.json ./
RUN npm install
COPY . .

CMD [ "npm", "start" ]