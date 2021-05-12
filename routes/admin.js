const express = require("express");
const router = express.Router();
const data = require("../data");
const adminData = data.admin;
const productsData = data.products;

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

module.exports = router;
