const express = require("express");
const router = express.Router();
const data = require("../data");
const bcrypt = require("bcryptjs");
usersData = data.users;
const xss = require("xss");
errorCheck = require("../errorCheck");

router.get("/form", async (req, res) => {
  console.log("out of /form");
  if (req.session.user) {
    console.log("into 1st /form");

    return res.redirect("/users/details");
  } else {
    console.log("into 2nd /form");

    return res.render("pages/loginPage", {
      title: "First",
    });
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  req.session.user = null;
  return res.redirect("/products");
});

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
  console.log(req.session.user);

  try {
    if (req.session.user) {
      const userInfo = await usersData.getUser(req.session.user._id);
      console.log("fdsc");
      const userComments = await usersData.getUserComments(
        req.session.user._id
      );
      console.log("rfeds");
      // const userLikes = await usersData.getUserLikedProducts(req.params.id);
      const userViewedProduct = await usersData.getUserViewedProdcuts(
        req.session.user._id
      );
      console.log("fds");
      const userBoughtProducts = await usersData.getUserBoughtProducts(
        req.session.user._id
      );
      console.log("fr");

      return res.render("pages/userDetail", {
        title: "User Info page",
        userInfo: userInfo,
        comments: userComments,
        // likes: userLikes,
        viewdProduct: userViewedProduct,
        purchase: userBoughtProducts,
      });
    } else {
      return res.json({ message: "Not  signedIn" });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const userInfo = await usersData.getUser(req.params.id);
    res.json(userInfo);
  } catch (error) {
    res.status().json({ message: "No Data (/:id)" });
  }
});

// router.get("/form", async (req, res) => {
//   console.log("out of /form");
//   if (req.session.user) {
//     console.log("into 1st /form");

//     return res.redirect("/users/details");
//   } else {
//     console.log("into 2nd /form");

//     return res.render("pages/loginPage", {
//       title: "First",
//     });
//   }
// });

// router.get("/login", async (req, res) => {
//   if (req.session.user) {
//     return res.redirect("/users/details"); //temporarily    redirect to products route
//   } else {
//     return res.render("pages/loginPage", { title: "Login Page" });
//   }

router.post("/login", async (req, res) => {
  console.log("login");
  if (req.session.user) {
    return res.render("pages/userDetail", { title: "Already In" });
  } else {
    const email = xss(req.body.email.trim());
    const password = xss(req.body.password.trim());
    let userClient;
    console.log("\n\n Email: ", email, "\n\n");
    errors = [];

    if (errorCheck.stringCheck(email) == false)
      errors.push("Invalid user E-mail address.");
    if (errorCheck.stringCheck(password) == false)
      errors.push("Invalid password.");

    const users = await usersData.getAllUsers();
    for (let i = 0; i < users.length; i++) {
      if (users[i].emailId == email) {
        userClient = users[i];
      }
    }
    console.log("UserClient: ", userClient);
    if (!userClient)
      errors.push("User E-mail address or password does not match.");

    if (errors.length > 0) {
      return res.render("pages/loginPage", {
        title: "No Match found",
        errors: errors,
      });
    }

    let match = await bcrypt.compare(password, userClient.password);
    console.log("Match : ", match);
    console.log("Error: ", errors);
    if (match) {
      req.session.user = userClient;
      // let comp = req.session.previousRoute;
      // if (comp) {
      req.session.previousRoute = "";
      req.session.cartItems = [];
      return res.redirect("/users/details");
      // }
      // return res.redirect("/products");
    } else {
      errors.push("User E-mail address or password does not match");
      return res.render("pages/loginPage", {
        title: "Errors",
        // partial: "login-script",
        errors: errors,
      });
    }
  }
});

router.get("/signup", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/products");
  }
  return res.render("pages/signup-page");
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
    return res.json({ errors: "Erros while adding" });
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

    return res.render("pages/signup", {
      firstName: newUser.firstName,
      title: "Testing",
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: " error from addUser()" });
  }
});

module.exports = router;
