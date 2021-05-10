// const mainRoutes = require('./routes');
const productsRoutes = require("./products");
const path = require("path");
const userRoutes = require("./users.js");
const adminRoutes = require("./admin");
const commentsRoutes = require("./comments");
const constructorMethod = (app) => {
  // app.use("/", (req, res) => {
  //   return res.render("pages/home", { title: "In Home" });
  // });
  app.use("/", productsRoteus);
  app.use("/users", userRoutes);
<<<<<<< HEAD
  app.use("/", productsRoutes);
=======

>>>>>>> 1b3ecbe6980162bae874902d3d6841d6cccba873

  app.use("/admin", adminRoutes);
  app.use("/comments", commentsRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ title: "404: Error" });
  });
};

module.exports = constructorMethod;
