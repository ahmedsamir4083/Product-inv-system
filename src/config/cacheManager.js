var cacheManager = require('cache-manager');

var memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 3600});

module.exports = memoryCache;
