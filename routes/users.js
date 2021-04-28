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
    res.status().json({ message: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userInfo = await usersData.getUser(req.params.id);
    res.json(userInfo);
  } catch (error) {
    res.status().json({ message: error });
  }
});

router.post("/signup", async (req, res) => {
  const firstName = xss(req.body.firstName);
  const lastName = xss(req.body.lastName);
  const email = xss(req.body.email);
  const password = xss(req.body.password);
  const phoneNumber = xss(req.body.phoneNumber);
  const address = xss(req.body.address);

  errors = [];
  if (!errorCheck.stringCheck(firstName))
    errors.push("Invalid FirstName (routes/users)");
  if (!errorCheck.stringCheck(lastName))
    errors.push("Invalid LastName (routes/users)");
  if (!errorCheck.emailValidate(email))
    errors.push("Invalid Email (routes/users)");
  if (!errorCheck.validPassword(password))
    errors.push("Invalid Password (routes/users)");
  if (!errorCheck.phoneNumberValid(phoneNumber))
    errors.push("Invalid PhoneNumber (routes/users)");

  // Just for woking part I'm throwing JSON error
  if (errors.length > 0) {
    return res.status(401).json({ errors: "Erros while fil" });
  }
  try {
    const newUser = await userData.addUser(
      firstName,
      lastName,
      phoneNumber,
      emailId,
      password,
      address
    );
    req.seesion.user = newUser;
    //Just for now redirecting to the root route
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  // req.session.user=null;
  res.redirect("/");
});

module.exports = router;
