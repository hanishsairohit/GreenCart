// const mainRoutes = require('./routes');
const productsRoutes = require("./products");
const path = require("path");

const constructorMethod = (app) => {
  //   app.use('/', mainRoutes);
  app.use("/products", productsRoutes);
  app.use(
    "*",
    res.status(404).render("404: No Page Found!!", { title: "404: Error" })
  );
};

module.exports = constructorMethod;
