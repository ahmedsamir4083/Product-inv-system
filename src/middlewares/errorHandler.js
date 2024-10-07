

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }
}

class ServerError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 500;
    }
}

function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error(`${statusCode} - ${message}`);

    res.status(statusCode).json({
        success: false,
        message
    });
}

module.exports = { ValidationError, NotFoundError, ServerError, errorHandler };
