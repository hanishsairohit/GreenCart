const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");
const session = require("express-session");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(
  session({
    name: "AuthCookie",
    secret: "Some secret",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 60000 },
  })
);

//MIDDLEWARES

// Terminate acess tif user s not logged in.
app.use("/private", async (req, res, next) => {
  if (!req.session.user) {
    // TODO: need to implement error file to reDirect or render
    return res.redirect("/");
  } else {
    next();
  }
});

// buy button middleware
//if logged in will add to cart , else go to login page.
app.use("/addToCart", async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  } else {
    //buy button should trigger
    return res.redirect("/");
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
