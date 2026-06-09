const { redisClient } = require("../utils/redisClient");

const cacheMiddleware = (ttl = 3600) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        console.log(`\x1b[32m🚀 [Redis] CACHE HIT: ${key}\x1b[00m`);
        return res.status(200).json(JSON.parse(cachedData));
      }

      console.log(`\x1b[33m☁️ [Redis] CACHE MISS: ${key} - Veri DB'den alınıyor...\x1b[00m`);

      // If not cached, override res.json to catch the data and store it in Redis
      const originalJson = res.json;
      res.json = (data) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redisClient.setEx(key, ttl, JSON.stringify(data))
            .then(() => console.log(`\x1b[36m💾 [Redis] Veri Önbelleğe Kaydedildi: ${key}\x1b[00m`))
            .catch(err => console.error("Redis Cache Save Error:", err));
        }
        return originalJson.call(res, data);
      };

      next();
    } catch (error) {
      console.error("Redis Cache Middleware Error:", error);
      next(); // Proceed without cache on error
    }
  };
};

module.exports = { cacheMiddleware };
