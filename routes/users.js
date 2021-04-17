const express = require("express");
const router = express.Router();
const data = require("../data");
usersData = data.users;

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

router.post("/:id", async (req, res) => {
  try {
  } catch (error) {
    res.status().json({ message: error });
  }
});

module.exports = router;
