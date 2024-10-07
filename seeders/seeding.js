const Product = require('../src/models/Product');
const Category = require('../src/models/Category');
const sequelize = require('../src/config/database');

const seedDatabase = async () => {
  try {
  
    await sequelize.sync({ force: true });


    const categoriesData = [
      { Category_name: 'Electronics' },
      { Category_name: 'Clothing' },
      { Category_name: 'Books' },
      { Category_name: 'Sports' },
      { Category_name: 'Beauty' },
    ];


    const categories = await Category.bulkCreate(categoriesData, { returning: true });

    
    const productNames = {
      Electronics: ['Smartphone', 'Laptop', 'Tablet', 'Headphones', 'Smartwatch', 'Camera', 'Drone', 'Monitor', 'Router', 'TV'],
      Clothing: ['T-shirt', 'Jeans', 'Jacket', 'Sweater', 'Shoes', 'Hat', 'Dress', 'Socks', 'Gloves', 'Scarf'],
      Books: ['Fiction Novel', 'Biography', 'Science Book', 'History Book', 'Fantasy Novel', 'Thriller', 'Children’s Book', 'Comics', 'Textbook', 'Cookbook'],
      Sports: ['Football', 'Basketball', 'Tennis Racket', 'Baseball Glove', 'Running Shoes', 'Yoga Mat', 'Golf Clubs', 'Hiking Backpack', 'Bicycle', 'Cricket Bat'],
      Beauty: ['Lipstick', 'Foundation', 'Mascara', 'Perfume', 'Face Cream', 'Shampoo', 'Conditioner', 'Nail Polish', 'Hair Dryer', 'Body Lotion'],
    };


    const productsData = [];

    categories.forEach(category => {
      productNames[category.Category_name].forEach((name, index) => {
        productsData.push({
          Product_name: name,
          Product_description: `This is a ${name} from the ${category.Category_name} category.`,
          Product_price: Math.floor(Math.random() * 100) + 1, 
          Product_quantity: Math.floor(Math.random() * 20) + 1,
          Category_id: category.Category_id,
          isDeleted: false,
        });
      });
    });

    await Product.bulkCreate(productsData);

    console.log('Database seeded successfully with categories and products!');
  } catch (error) {
    console.error('Failed to seed database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
