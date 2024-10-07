const logMetrics = (req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logMessage = `
            Method: ${req.method}
            Endpoint: ${req.originalUrl}
            Status Code: ${res.statusCode}
            Response Time: ${duration}ms
        `;
        console.log(logMessage);
    });

    next();
};

module.exports = logMetrics;
