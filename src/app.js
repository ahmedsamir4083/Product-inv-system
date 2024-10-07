const express = require('express');
const productRoutes = require('./routes/productRoutes');
const path = require('path')
const categoryRoutes = require('./routes/categoryRoutes');
const sequelize = require('./config/database');
const bodyParser = require('body-parser')
const methodOverride = require('method-override');
const { errorHandler } = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');

const app = express();

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(methodOverride('_method'));



app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.static(__dirname + '/public'));
app.use(requestLogger);

// Routes
app.get('/',(res,req)=>{
    req.render('Home')
})
app.use('/products', productRoutes);
app.use('/category', categoryRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;

