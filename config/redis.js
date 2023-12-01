const redis = require('redis');

const redisClient = redis.createClient({url:process.env.REDIS_URI});
// const redisClient = redis.createClient();
(async () => {
  await redisClient.connect();
})();

redisClient.on("connect", () => console.log("Redis Client Connected"));
redisClient.on("error", (err) => console.log("Redis Client Connection Error", err));
module.exports = redisClient;
