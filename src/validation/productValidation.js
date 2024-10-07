const { ValidationError } = require('../middlewares/errorHandler');

const validateProduct = (req, res, next) => {
    const { Product_name, Product_description, Product_price, Product_quantity, Category_id } = req.body;

    if (!Product_name || typeof Product_name !== 'string') {
        return next(new ValidationError('Invalid or missing Product Name'));
    }

    if (!Product_description || typeof Product_description !== 'string') {
        return next(new ValidationError('Invalid or missing Product Description'));
    }


    next();
};

module.exports = validateProduct;
