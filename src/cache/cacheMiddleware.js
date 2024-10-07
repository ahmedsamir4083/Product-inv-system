const memoryCache = require('../config/cacheManager');

const cacheMiddleware = (cacheKey, ttl) => {
    return async (req, res, next) => {
        try {
           
            const cachedData = await memoryCache.get(cacheKey);

            if (cachedData) {
                
                return res.json(cachedData);
            }


            res.sendResponse = res.json;
            res.json = async (body) => {
               
                await memoryCache.set(cacheKey, body, { ttl });
                res.sendResponse(body);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};

module.exports = cacheMiddleware;

