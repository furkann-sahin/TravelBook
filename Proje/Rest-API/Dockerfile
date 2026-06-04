FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN mkdir -p public/uploads

EXPOSE 3000

CMD ["npm", "start"]
