// const mainRoutes = require('./routes');
const productsRoutes = require("./products");
const path = require("path");
const userRoutes = require("./users.js");

const constructorMethod = (app) => {
  // app.use("/", (req, res) => {
  //   return res.render("pages/home", { title: "In Home" });
  // });
  app.use("/", productsRoutes);
  app.use("/users", userRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ title: "404: Error" });
  });
};

module.exports = constructorMethod;
