const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const cacheMiddleware = require('../cache/cacheMiddleware');
const cacheInvalidationMiddleware = require('../cache/cacheInvalidate');
const validateProduct = require('../validation/productValidation');




router.get('/', cacheMiddleware('productsAndCategories', 3600), async (req, res, next) => {

  const limit = 5;
  const page = parseInt(req.query.page) || 1;

  try {

    const totalProducts = await Product.count({
      where: { isDeleted: false }
  });
  
  const totalPages = Math.ceil(totalProducts / limit);
  
  const offset = (page - 1) * limit;

      const categories = await Category.findAll({
          where: { isDeleted: false }
      });

      const product = await Product.findAll({
        where: { isDeleted: false },
        limit: limit,
        offset: offset
      });

      const totalValue = product.map(prod => prod.Product_price * prod.Product_quantity);

      // res.render('product/productHome', {  product,
      //   categories,
      //   totalValue,
      //   currentPage: page,
      //   totalPages: totalPages
      // });

      res.json({
        success: true,
        products: product,
        totalValue: totalValue,
        currentPage: page,
        totalPages: totalPages
      });
  } catch (error) {
      next(new ServerError("Failed to fetch products and categories."));
  }
});



router.post('/filterByCategory', cacheMiddleware('productsAndCategories', 3600), async (req, res, next) => {
  const { categoryId } = req.body;
  const limit = 5;
  const page = parseInt(req.query.page) || 1;

  try {

    const totalProducts = await Product.count({
      where: { 
        Category_id: categoryId,
        isDeleted: false 
      }
    });

    const totalPages = Math.ceil(totalProducts / limit);

    const offset = (page - 1) * limit;

    const categories = await Category.findAll({
      where: { isDeleted: false }
    });

    const product = await Product.findAll({
      where: { 
        Category_id: categoryId,
        isDeleted: false
      },
      limit: limit,
      offset: offset
    });

    const totalValue = product.map(prod => prod.Product_price * prod.Product_quantity);

    // res.render('product/productHome', { 
    //   product, 
    //   categories, 
    //   totalValue,
    //   currentPage: page,
    //   totalPages: totalPages 
    // });

     res.json({
        success: true,
        products: product,
        categories: categories,
        totalValue: totalValue,
        currentPage: page,
        totalPages: totalPages
      });

  } catch (error) {
    next(new ServerError("Failed to fetch products and categories."));
  }
});


// router.get('/addProduct', async (req, res) => {

//     const categories = await Category.findAll({
//         where: {
//           isDeleted: false,
//         },
//       });

//     res.render('product/addProduct',{categories})


// });

router.post('/',validateProduct, cacheInvalidationMiddleware, async (req, res) => {
  var { Product_name, Product_description, Product_price, Product_quantity, Category_id } = req.body;

  try {
      await Product.create({
          Product_name,
          Product_description,
          Product_price,
          Product_quantity,
          Category_id,
          isDeleted: false
      });

      res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// router.get('/searchProduct', async (req, res) => {

//     res.render('product/searchProduct')

// });

router.post('/searchNameProduct', async (req, res) => {

  const {productName} = req.body;

  
  const product = await Product.findOne({
    where: {
      Product_name: productName,
      isDeleted: false,
    }
  });

  if (!product) {
    // return res.render('product/searchResult', { product: null, categories: null, totalValue: null });

    res.status(500).json({ message: 'Failed to find product' });
  }

  const categories = await Category.findOne({
    where: {
      Category_id: product.Category_id,
    }
  });

  const totalValue = product.Product_price*product.Product_quantity;


  // res.render('product/searchResult', { product, categories,totalValue});
  res.json({product , totalValue})

});

// router.get('/updateProduct/:id',async (req, res) => {

//     const id = req.params.id;
//     const product = await Product.findOne({ where: { Product_id: id } });
//     res.render('product/updateProduct',{product});
//   });

  router.put('/updateProduct/:id',validateProduct,cacheInvalidationMiddleware, async (req, res, next) => {
    const id = req.params.id;
    const { Product_name, Product_description, Product_price, Product_quantity } = req.body;

    try {
        const product = await Product.findOne({ where: { Product_id: id } });

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        product.Product_name = Product_name;
        product.Product_description = Product_description;
        product.Product_price = Product_price;
        product.Product_quantity = Product_quantity;
        product.updatedAt = new Date();

        await product.save();

        res.redirect('/products');
    } catch (error) {
        next(error);
    }
});

// router.get('/deleteProduct/:id',async (req, res) => {

//     const id = req.params.id;
//     const product = await Product.findOne({ where: { Product_id: id } });
//     res.render('product/deleteProduct',{product});
//   });



  router.delete('/deleteProduct/:id',cacheInvalidationMiddleware,async (req, res) => {

    const id = req.params.id;
    const product = await Product.findOne({ where: { Product_id: id } });
    
    if (product) {

        product.isDeleted = true;
        await product.save();
        res.redirect('/products');
    }
  
  });

  // router.get('/productBin',async (req, res) => {

  //   const product = await Product.findAll({
  //       where: {
  //         isDeleted: true,
  //       },
  //     });

  //     if (product) {

  //       res.render('product/productBin',{product});
  //   }

  // });

  router.get('/restoreProduct/:id',async (req, res) => {

    const id = req.params.id;
    const product = await Product.findOne({ where: { Product_id: id } });
    
    if (product) {

        product.isDeleted = false;
        await product.save();
        res.redirect('/products');
    }
  });

  // for testing try(http://localhost:3000/products/sort?criteria=Product_price&sort=asc)
  // for testing try(http://localhost:3000/products/sort?criteria=Product_price&sort=desc)
  // for testing try(http://localhost:3000/products/sort?criteria=Product_quantity&sort=asc)
  // for testing try(http://localhost:3000/products/sort?criteria=Product_quantity&sort=desc)
  router.get('/sort',async (req, res) => {

    const sortOption = req.query.sort;
    const criteria = req.query.criteria ;

    const product = await Product.findAll({
      where: {
        isDeleted: false
      },
      order: [[criteria, sortOption]]
    });

    const categories = await Category.findAll({
      where: {
        isDeleted: false
      }
    });
    
    var totalValue=[];

      product.forEach(product => {
        totalValue.push(product.Product_price*product.Product_quantity); 
      });


    // res.render('product/productHome', { product, categories,totalValue });

  res.json({product,categories,totalValue});
  });

  router.get('/:id', async (req, res) => {

    const id = req.params.id;

    const product = await Product.findOne({ where: { Product_id: id } });

   

    if (product) {
        const Category_id = product.Category_id;
        const categories = await Category.findOne({ where: { Category_id: Category_id } });
        const totalValue = product.Product_price*product.Product_quantity;
        // res.render('product/searchResult', { product,categories,totalValue });

        res.json({product,categories,totalValue})
    } else {
       
        res.render('product/searchResult', { product: null });
    }

});


module.exports = router;