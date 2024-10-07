const { ValidationError } = require('../middlewares/errorHandler');

const validateCategory = (req, res, next) => {
    const { Category_name } = req.body;

    if (!Category_name || typeof Category_name !== 'string') {
        return next(new ValidationError('Invalid or missing Category Name'));
    }

    next();
};

module.exports = validateCategory;
