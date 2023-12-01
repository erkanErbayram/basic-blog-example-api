FROM node:18.17.1 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

FROM node:18.17.1-alpine

WORKDIR /app

# ENV MONGODB_URI=mongodb://mongodb-service:27017/mydatabase
# ENV REDIS_URI=redis://redis-service:6379

COPY --from=builder /app .

EXPOSE 5000
CMD ["node", "server.js"]
