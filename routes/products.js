
const express = require('express');
const router = express.Router();
const data = require('../data');
const productsData = data.products;


//to get all products data
router.get('/', async (req, res) => {
  try {
    let productList = await productsData.getAllProducts();
    res.json(productList);
  } catch (e) {
    res.sendStatus(400);
  }
});


//to get product by Id provided
router.get('/:id', async (req, res) => {
  try {
    let product = await productsData.getProductById(req.params.id);
    res.json(product);
  } catch (e) {
    res.status(404).json({ error: 'product not found' });
  }
});

//to add product to DB
router.post('/products', async (req, res) => {
  const productInfo = req.body;
  console.log(req.body);
  if (!productInfo) {
    res.status(400).json({ error: 'You must provide data to create a Product' });
    return;
  }

  if (!productInfo.title) {
    res.status(400).json({ error: 'You must provide a title' });
    return;
  }

  try {
    const { title, description, productImage, noOfLikes, comments, likedBy, createdBy, createdAt } = productInfo;
    const newProduct = await productsData.addProducts(title, description, productImage, noOfLikes, comments, likedBy, createdBy, createdAt);
    res.json(newProduct);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Product was not added" });
  }

});

module.exports = router;