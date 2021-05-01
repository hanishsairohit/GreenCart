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

router.get("/:id", async (req, res) => {
  try {
    const userInfo = await usersData.getUser(req.params.id);
    res.json(userInfo);
  } catch (error) {
    res.status().json({ message: "No Data (/:id)" });
  }
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
    console.log(newUser);
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
