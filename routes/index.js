// const mainRoutes = require('./routes');
const productsRoutes = require("./products");
const path = require("path");
const userRoutes = require("./users.js");

const constructorMethod = (app) => {
  //   app.use('/', mainRoutes);
  app.use("/products", productsRoutes);
  app.use("/users", userRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ title: "404: Error" });
  });
};

module.exports = constructorMethod;
