// const mainRoutes = require('./routes');
const productsRoutes = require('./products');
const path = require('path');

const constructorMethod = (app) => {
//   app.use('/', mainRoutes);
  app.use('/products', productsRoutes);
};

module.exports = constructorMethod;