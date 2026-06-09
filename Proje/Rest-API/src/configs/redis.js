const Redis = require("ioredis");

let client = null;

function connectRedis() {
  const url = process.env.REDIS_URL;
  if (!url) {
    console.warn("[Redis] REDIS_URL not set — caching disabled");
    return;
  }

  client = new Redis(url, {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
  });

  client.on("connect", () => console.log("[Redis] Connected"));
  client.on("error", (err) => console.error("[Redis] Error:", err.message));
}

function getRedisClient() {
  return client;
}

module.exports = { connectRedis, getRedisClient };
