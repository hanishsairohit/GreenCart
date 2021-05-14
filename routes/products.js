const express = require("express");
const router = express.Router();
const data = require("../data");
const productsData = data.products;

const commentsData = data.comments;
const productType = data.productType;

const errorHandler = require("../Error/DatabaseErrorHandling");
const { get, route } = require("./users");

router.post("/product", async (req, res) => {
  const productInfo = req.body;

  productInfo["price"] = parseFloat(productInfo.price);
  productInfo["stock"] = parseInt(productInfo.stock);

  console.log(productInfo.productImage);

  console.log(productInfo);
  try {
    if (isNaN(productInfo["price"])) {
      throw "price is nan";
    }

    if (isNaN(productInfo["stock"])) {
      throw "Stock is nan";
    }
    errorHandler.checkObject(productInfo, "Product form data");
    errorHandler.checkString(productInfo.title, "title");
    errorHandler.checkString(productInfo.description, "Description");
    errorHandler.checkString(productInfo.productImage, "Product Image"); //have to check other test cases
    errorHandler.checkString(productInfo.createdBy, "Created By");
    errorHandler.checkInt(productInfo.stock, "Stock");
    errorHandler.checkFacet(productInfo.facet);
    errorHandler.checkFloat(productInfo.price, "price");

    const { title, description, productImage, createdBy, stock, facet, price } =
      productInfo;

    const newProduct = await productsData.addProduct(
      title,
      description,
      productImage,
      createdBy,
      stock,
      facet,
      price
    );
    res.json(newProduct);
  } catch (error) {
    console.log(error);
    if (Array.isArray(error)) {
      error = error[0];
      res.status(400);
      res.json({ error });
    } else {
      res.status(500);
      res.json({ "Product was not added": "" });
    }
  }
});

router.delete("/product/:id", async (req, res) => {
  try {
    errorHandler.checkStringObjectId(req.params.id, "Product ID");
    const product = await productsData.getProductById(req.params.id);
    await productsData.deleteProduct(req.params.id, product.stock);
    res.json(product);
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

//to get all products to display on root route
router.get("/", async (req, res) => {
  try {
    let productList = await productsData.getAllProducts();
    if (productList.length > 0) {
      hasProduct = true;
    }

    return res.render("pages/home", {
      title: "All Product List",
      productList: productList,
      hasProduct: hasProduct,
    });
  } catch (e) {
    return res.sendStatus(400);
  }
});

//to get product by Id provided
router.get("/products/product/:id", async (req, res) => {
  try {
    // if (req.session.user) {
    errorHandler.checkStringObjectId(req.params.id, "Product ID");
    let product = await productsData.getProductById(req.params.id);
    const productComments = await productsData.getProductComments(
      req.params.id
    );

    const commentList = [];
    for (comment of productComments) {
      commentList.push(comment.commentText);
    }

    await usersData.userViewsAProduct(
      "609a2fca59ef0ecfeb7b57af",
      req.params.id
    );

    let hascomments = true;

    if (commentList.length == 0) {
      hascomments = false;
    }

    res.render("pages/singleProduct", {
      title: product.title,
      product: product,
      comments: commentList,
      hascomments: hascomments,
    });

    // } else {
    //   res.sendStatus(404).json({ message: "User not Authenticated" });
    // }
  } catch (e) {
    return res.status(404).json({ error: "product not found" });
  }
});

router.patch("/product/like/:id", async (req, res) => {
  try {
    console.log("edsx");
    errorHandler.checkStringObjectId(req.params.id, "Product ID");
    if (req.session.user) {
      await productsData.addLike(req.params.id, req.session.user._id);
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});
router.patch("/product/dislike/:id", async (req, res) => {
  try {
    errorHandler.checkStringObjectId(req.params.id, "Product ID");
    if (req.session.user) {
      await productsData.addDisLike(req.params.id, req.session.user._id);
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

router.patch("/product/comment/:id", async (req, res) => {
  const comment_text = req.body.review;
  try {
    errorHandler.checkStringObjectId(req.params.id, "Product ID");
    errorHandler.checkString(comment_text);
    if (req.session.user) {
      await commentsData.addComment(
        req.session.user._id,
        req.params.id,
        comment_text
      );
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

router.patch("/addtocart/:id", async (req, res) => {
  try {
    errorHandler.checkStringObjectId(req.params.id, "Product ID");
    if (req.session.user) {
      console.log(req.session);
      req.session.cartItems.push(req.params.id);
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

router.get("/cart/", async (req, res) => {
  try {
    if (req.session.user) {
      const productsList = [];
      let unique = req.session.cartItems.filter(
        (v, i, a) => a.indexOf(v) === i
      );
      for (i of unique) {
        productsList.push(await productsData.getProductById(i));
      }
      res.json(productsList);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

router.get("/producttypes", async (req, res) => {
  try {
    const types = await productType.getProductTypes();
    const result = [];
    for (type of types) {
      result.push(type.type);
    }
    res.status(200);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

router.get("/properties/:type", async (req, res) => {
  try {
    errorHandler.checkString(req.params.type);
    const types = await productType.getProductTypes();
    const result = [];
    for (type of types) {
      if (type.type == req.params.type) {
        for (prop of type.properties) {
          const { name, type, values } = prop;
          result.push({ name, type, values });
        }
        res.json(result);
        return;
      }
    }
    res.status(200);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

router.post("/search", async (req, res) => {
  console.log("hello");
  const searchTerm = req.body.searchTerm;
  try {
    errorHandler.checkString(searchTerm);
    const productList = await productsData.searchProduct(searchTerm);

    if (productList.length > 0) {
      hasProduct = true;
    }
    return res.render("pages/home", {
      title: "All Product List",
      productList: productList,
      hasProduct: hasProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.post("/filter", async (req, res) => {
  const filterProp = req.body;
  try {
    const productTypesList = await productType.getProductTypes();
    for (type of productTypesList) {
      if (type.type == filterProp["product_type"]) {
        for (prop of type.properties) {
          if (prop.type == "number") {
            if (filterProp[prop.name]) {
              filterProp[prop.name] = parseFloat(filterProp[prop.name]) + 1; //adding one to increase the limit of search
              if (isNaN(filterProp[prop.name])) {
                delete filterProp[prop.name];
                filterProp[prop.name] = Number.MIN_VALUE;
              }
            }
          }
        }
      }
    }

    console.log(filterProp);

    errorHandler.checkFilterProperties(filterProp);
    const productList = await productsData.filterProducts(filterProp);

    let hasProduct = false;

    if (productList.length > 0) {
      hasProduct = true;
    }

    return res.render("pages/home", {
      title: "All Product List",
      productList: productList,
      hasProduct: hasProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.get("/getUserLikedProducts/", async (req, res) => {
  try {
    if (req.session.user) {
      errorHandler.checkStringObjectId(req.session.user._id);
      let likedProducts = await usersData.getUserLikedProducts(
        req.session.user._id
      );

      likedProducts = likedProducts.filter((v, i, a) => a.indexOf(v) === i);

      res.json(likedProducts);
    } else {
      res.status(400).json({ message: "not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
