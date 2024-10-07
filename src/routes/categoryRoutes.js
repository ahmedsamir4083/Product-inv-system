const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const cacheMiddleware = require('../cache/cacheMiddleware');
const cacheInvalidationMiddleware = require('../cache/cacheInvalidate');
const validateCategory = require('../validation/categoryValidation');






router.get('/', cacheMiddleware('productsAndCategories', 3600), async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: { isDeleted: false }
    });
    res.json({ success: true, categories });
  } catch (error) {
    next(new Error("Failed to fetch categories"));
  }
});
  

  router.get('/addCategory', (req, res) => {
    res.render('addCategory');
  });
  

  router.post('/addCategory',cacheInvalidationMiddleware, async (req, res) => {
    const { Category_name, Category_description } = req.body;
  
    try {

      await Category.create({
        Category_name,
        Category_description,
      });
      res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create category' });
    }
});


router.get('/searchCategory', (req, res) => {
    res.render('searchCategory');
  });

  router.post('/search',async (req, res) => {
    const id = req.body.id;
    const category = await Category.findOne({ where: { Category_id: id } });

    if (category) {

        res.json({ category })
        // res.render('searchResult', { category });
    } else {

        // res.render('searchResult', { category: null });
        res.status(500).json({ message: 'Failed to find category' });
    }
  });

  // router.get('/updateCategory/:id',async (req, res) => {

  //   const id = req.params.id;
  //   const category = await Category.findOne({ where: { Category_id: id } });
  //   res.render('updateCategory',{category});
    
  // });

  router.put('/updateCategory/:id',validateCategory,cacheInvalidationMiddleware, async (req, res) => {
    const id = req.params.id;
    const { Category_name, Category_description } = req.body;

    try {
        const category = await Category.findOne({ where: { Category_id: id } });

        if (category) {
            category.Category_name = Category_name;
            category.Category_description = Category_description;
            category.createdAt = category.createdAt;
            category.updatedAt = new Date();

            await category.save();
            

            
            res.redirect('/category')


        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


// router.get('/deleteCategory/:id',async (req, res) => {

//     const id = req.params.id;
//     const category = await Category.findOne({ where: { Category_id: id } });
//     res.render('deleteCategory',{category});
//   });



  router.delete('/deleteCategory/:id',cacheInvalidationMiddleware,async (req, res) => {

    const id = req.params.id;
    const category = await Category.findOne({ where: { Category_id: id } });
    
    if (category) {

        category.isDeleted = true;
        await category.save();
        res.redirect('/category');
    }
  
  });

  router.get('/categoryBin',async (req, res) => {

    const category = await Category.findAll({
        where: {
          isDeleted: true,
        },
      });

      if (category) {

        res.render('categoryBin',{category});
    }
  });

  router.get('/restoreCategory/:id',async (req, res) => {

    const id = req.params.id;
    const category = await Category.findOne({ where: { Category_id: id } });
    
    if (category) {

        category.isDeleted = false;
        await category.save();
        res.redirect('/category');
    }
  });

  







module.exports = router;