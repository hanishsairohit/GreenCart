const express = require("express");
const router = express.Router();
const data = require("../data");
const adminData = data.admin;
const productsData = data.products;
const usersData = data.users;
const bcrypt = require("bcryptjs");
const errorCheck = require("../errorCheck");
const xss = require("xss");

dataError = require("../Error/DatabaseErrorHandling");
//////////////////////////////

router.get("/", async (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/");
  }
  try {
    let productList = await productsData.getAllProducts();
    if (productList.length > 0) {
      hasProduct = true;
    }
    return res.render("pages/admin", {
      title: "All Product List",
      productList: productList,
      hasProduct: hasProduct,
    });
  } catch (e) {
    return res.sendStatus(400);
  }
});
////////////////////////////////
router.get("/users/:id", async (req, res) => {
  console.log(req.session.admin);
  errors = [];
  if (!req.session.admin) {
    return res.render("pages/home", { title: "Admin Access Only" });
  }
  try {
    userInfo = await usersData.getUser(req.params.id);
    console.log(userInfo);

    if (userInfo) {
      return res.render("pages/userInfo", {
        title: "User Information",
        userInfo: userInfo,
        adminAuth: true,
      });
    }
  } catch (error) {
    errors.push(error);
    return res.render("pages/home", {
      title: "Admin Access Only",
      adminErrors: errors,
      adminAuth: false,
    });
  }
});

/////////////////////////////////
router.get("/signup", async (req, res) => {
  if (req.session.admin) {
    return res.redirect("/admin");
  } else {
    return res.render("pages/adminSignup", {
      title: "New adminSignup",
      adminAuth: false,
    });
  }
});
////////////////////////////////

router.post("/signup", async (req, res) => {
  if (req.session.admin) {
    res.redirect("/admin");
  } else {
    adminInfo = xss(req.body);
    firstName = xss(req.body.adminFirstName);
    lastName = xss(req.body.adminLastName);
    adminId = xss(req.body.adminId);
    adminPassword = xss(req.body.adminPassword);
    secretPasscode = xss(req.body.secretPasscode);
    errors = [];
    if (!errorCheck.stringCheck(firstName)) errors.push("Invalid First Name");
    if (!errorCheck.stringCheck(lastName)) errors.push("Invalid Last Name");
    if (!errorCheck.emailValidate(adminId)) errors.push("Invalid Admin Id");
    if (!errorCheck.validPassword(adminPassword))
      errors.push("Invalid Admin Password");

    if (!errorCheck.stringCheck(secretPasscode))
      errors.push("Invalid Passcode");
    if (!(secretPasscode == "CS546")) errors.push("Invalid Passcode");
    if (errors.length > 0) {
      return res.render("pages/adminSignup", {
        adminAuth: req.session.admin ? true : false,
        title: "Signup Error",
        info: adminInfo,
        adminErrors: errors,
      });
    }
  }
  try {
    const allAdmin = await adminData.getAllAdmins();
    let emailUsed;
    if (!allAdmin) {
      emailUsed = false;
      return emailUsed;
    } else {
      allAdmin.find((element) => {
        if (element.emailID == adminId.toLowerCase()) {
          emailUsed = true;

          errors.push("Email already used");
          return emailUsed;
        } else {
          emailUsed = false;
          return emailUsed;
        }
      });
    }
    if (emailUsed == false) {
      const newAdmin = await adminData.addAdmin(
        firstName,
        lastName,
        adminPassword,
        adminId.toLowerCase()
      );
      req.session.admin = newAdmin;
      return res.render("pages/home", {
        title: "New admin Created",
        adminAuth: req.session.admin ? true : false,
      });
    } else {
      return res.render("pages/adminSignup", {
        title: errors[0],
        adminErrors: errors,
        adminAuth: false,
      });
    }
  } catch (error) {
    console.log("admin/signup :", error);
  }
});
// //////////////////////////////

router.post("/adminLogin", async (req, res) => {
  if (req.session.admin) {
    return res.redirect("/admin");
  }
  try {
    let adminEmail = xss(req.body.adminEmail);
    let adminPassword = xss(req.body.adminPassword.trim());
    errors = [];
    if (errorCheck.emailValidate(adminEmail) == false)
      errors.push("Invalid user E-mail");
    if (errorCheck.validPassword(adminPassword) == false)
      errors.push("Inavlid Password!!");
    adminEmail = adminEmail.toLowerCase();
    const allAdmin = await adminData.getAllAdmins();
    for (i = 0; i < allAdmin.length; i++) {
      if (allAdmin[i].emailID == adminEmail) {
        adminUser = allAdmin[i];
      }
    }

    if (!adminUser)
      errors.push("Admin's Email Address or Password does not match");

    if (errors.length > 0) {
      return res.render("pages/home", {
        title: "No admin found",
        adminErrors: errors,
      });
    }

    let matchPass = bcrypt.compareSync(adminPassword, adminUser.password);

    if (matchPass) {
      req.session.admin = adminUser;
      console.log(req.session.admin);

      return res.redirect("/admin");
    } else {
      errors.push("Admins's Email or password does not match");
      return res.render("pages/home", {
        title: "Admin Login Error",
        adminErrors: errors,
      });
    }
  } catch (error) {
    errors.push(error);
    return res.render("pages/home", {
      title: "Admin Login Error",
      adminErrors: errors,
    });
  }
});
////////////////////////////////////////////////////////////////
//admin logout

router.get("/logout", async (req, res) => {
  try {
    if (req.session.admin) {
      req.session.destroy();
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
});

/////////////////////////////////
//Users userInfo

router.get("/users", async (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/");
  }
  try {
    errors = [];
    usersDetails = await usersData.getAllUsers();
    if (usersDetails.length > 0) {
      hasUsers = true;
      return res.render("pages/usersList", {
        title: "Users List",
        users: usersDetails,
        hasUsers: hasUsers,
        adminAuth: req.session.admin ? true : false,
      });
    }
  } catch (error) {
    errors.push(error);
    return res.render("pages/home", {
      title: "Admin Access Only",
      errors: errors,
      adminAuth: false,
    });
  }
});
////////////////////////////////

module.exports = router;
