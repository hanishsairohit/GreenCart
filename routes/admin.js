const express = require("express");
const router = express.Router();
const data = require("../data");
const adminData = data.admin;
const productsData = data.products;
const bcrypt = require("bcryptjs");
const e = require("express");
dataError = require("../Error/DatabaseErrorHandling");
errorCheck = require("../errorCheck");

router.get("/", async (req, res) => {
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

router.post("/adminLogin", async (req, res) => {
  try {
    if (req.session.admin) {
      return res.redirect("/admin");
    } else {
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
        return res.render("/", { title: "No admin found", errors: errors });
      }

      let matchPass = bcrypt.compareSync(adminPassword, adminUser.password);
      console.log(matchPass);
      if (matchPass) {
        req.session.admin = adminUser;
        console.log(adminUser);
        return res.redirect("/admin");
      } else {
        errors.push("Admins's Email or password does not match");
        return res.render("pages/home", {
          title: "Admin Login Error",
          errors: errors,
        });
      }
    }
  } catch (error) {
    consol.log(error);
  }
});

//admin logout

router.get("/logout", async (req, res) => {
  try {
    if (req.session.admin) {
      console.log(req.session.admin);
      req.session.destroy();
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
