const memoryCache = require('../config/cacheManager');

const cacheInvalidationMiddleware = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
     
        memoryCache.del('productsAndCategories', (err) => {
            if (err) {
                console.error('Error while invalidating cache:', err);
            }
        });
    }
    next(); 
};

module.exports = cacheInvalidationMiddleware;