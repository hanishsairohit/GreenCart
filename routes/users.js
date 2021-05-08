const express = require("express");
const router = express.Router();
const data = require("../data");
usersData = data.users;
const xss = require("xss");
errorCheck = require("../errorCheck");

router.get("/", async (req, res) => {
  try {
    const usersInfo = await usersData.getAllUsers();
    res.json(usersInfo);
  } catch (error) {
    res.status().json({ message: "No Daata (/)" });
  }
});

// Users Details Pages
router.get("/details", async (req, res) => {
  try {
    // if (req.session.userId) {
    const userInfo = await usersData.getUser(req.params.id);
    const userComments = await usersData.getUserComments(req.params.id);
    // const userLikes = await usersData.getUserLikedProducts(req.params.id);
    const userViewedProduct = await usersData.getUserViewedProducts(
      req.params.id
    );
    const userBoughtProducts = await usersData.getUserBoughtProducts(
      req.params.id
    );

    return res.render("pages/userDetail", {
      title: "User Info page",
      userInfo: userInfo,
      comments: userComments,
      // likes: userLikes,
      viewdProduct: userViewedProduct,
      purchase: userBoughtProducts,
    });
    // }
    //    else {
    //     return res.json({ message: "Not  signedIn" });
    //   }
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userInfo = await usersData.getUser(req.params.id);
    res.json(userInfo);
  } catch (error) {
    res.status().json({ message: "No Data (/:id)" });
  }
});

router.get("/signin", async (req, res) => {
  if (req.session.userId) {
    return res.redirect("/index");
  }
  res.render("index/signin");
});

router.post("/signin", async (req, res) => {
  const email = xss(req.body.email.trim());
  const password = xss(req.body.password.trim());
  let userClient;

  errors = [];

  if (!verifier.validString(email)) errors.push("Invalid user E-mail address.");
  if (!verifier.validString(password)) errors.push("Invalid password.");

  const users = await userData.getAllUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].email == email) {
      userClient = users[i];
    }
  }

  if (!userClient)
    errors.push("User E-mail address or password does not match.");

  if (errors.length > 0) {
    return res.status(401).render("users/signin", {
      title: "Sign In",
      partial: "login-script",
      errors: errors,
    });
  }

  let match = await bcrypt.compare(password, userClient.hashedPassword);

  if (match) {
    req.session.user = userClient;
    let comp = req.session.previousRoute;
    if (comp) {
      req.session.previousRoute = "";
      return res.redirect(comp);
    }
    res.redirect("/");
  } else {
    errors.push("User E-mail address or password does not match");
    return res.status(401).render("users/signin", {
      title: "Errors",
      partial: "login-script",
      errors: errors,
    });
  }
});

router.get("/signup", async (req, res) => {
  if (req.session.userId) {
    return res.redirect("/index");
  }
  res.render("index/signup");
});

router.post("/signup", async (req, res) => {
  const firstName = xss(req.body.firstName);
  const lastName = xss(req.body.lastName);
  const email = xss(req.body.emailId);
  const password = xss(req.body.password);
  const phoneNumber = xss(req.body.phoneNumber);
  const address = xss(req.body.address);

  errors = [];
  if (!errorCheck.stringCheck(firstName))
    // errors.push;
    throw "Invalid FirstName (routes/users)";
  if (!errorCheck.stringCheck(lastName))
    // errors.push;
    throw "Invalid LastName (routes/users)";
  if (!errorCheck.emailValidate(email))
    // errors.push
    throw "Invalid Email (routes/users)";
  if (!errorCheck.validPassword(password))
    // errors.push
    throw "Invalid Password (routes/users)";
  if (!errorCheck.phoneNumberValid(phoneNumber))
    // errors.push
    throw "Invalid PhoneNumber (routes/users)";

  // Just for woking part I'm throwing JSON error
  if (errors.length > 0) {
    return res.status(401).json({ errors: "Erros while adding" });
  }
  try {
    const newUser = await usersData.addUser(
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      address
    );
    // console.log(newUser);
    // req.seesion.user = newUser;
    //Just for now redirecting to the root route
    // res.redirect("/");

    return res.render("pages/test", {
      firstName: newUser.firstName,
      title: "Testing",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: " error from addUser()" });
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  // req.session.user=null;
  res.redirect("/");
});

module.exports = router;
