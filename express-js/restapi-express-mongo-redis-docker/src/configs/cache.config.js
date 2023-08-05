const redis = require('redis');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Connect to Redis
// const client = new redisPromisify(redis.createClient(process.env.REDIS_URL));
const client = redis.createClient({
  legacyMode: true,
  url: process.env.REDIS_URL
});
(async () => {
  await client.connect();
})();

client.on('connect', () => console.log('Redis Client Connected'));
client.on('error', (err) => console.log('Redis Client Connection Error', err));

// Function to set data in Redis with expiration
const setDataInRedis = (key, data, expiration) => {
  client.setEx(key, expiration, JSON.stringify(data));
};

// Function to get data from Redis
const getDataFromRedis = (key, callback) => {
  client.get(key, (err, data) => {
    if (err) throw err;
    if (data !== null) {
      callback(JSON.parse(data));
    } else {
      callback(null);
    }
  });
};

module.exports = { setDataInRedis, getDataFromRedis };
