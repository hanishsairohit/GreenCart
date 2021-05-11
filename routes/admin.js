const express = require("express");
const router = express.Router();
const data = require("../data");
const adminData = data.admin;
const productsData = data.products;


//to get all products to display on root route
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
//to get 
// router.get('/', async (req, res) => {
//     try {
//         res.render("pages/admin");
//     } catch (e) {
//       res.sendStatus(400);
//     }
//     // if (req.session.user) {
//     //   console.log(13213);
//     // }

//   });

module.exports = router;
