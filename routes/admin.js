const express = require("express");
const router = express.Router();
const data = require("../data");
const adminData = data.admin;

router.get("/", async (req, res) => {
  try {
    res.render("pages/admin");
  } catch (e) {
    res.sendStatus(400);
  }
});

module.exports = router;
