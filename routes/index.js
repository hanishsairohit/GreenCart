// const mainRoutes = require('./routes');
const productsRoutes = require("./products");
const path = require("path");

const constructorMethod = (app) => {
  //   app.use('/', mainRoutes);
  app.use("/products", productsRoutes);
  app.use("/", (req, res) => {
    res.render("pages/test");
  });
};

module.exports = constructorMethod;
