const mongoCollections = require("../config/mongoCollections");
const products = mongoCollections.products;
const { ObjectId } = require("mongodb");

//functions in this file

//getAllProducts() // tested
//getProductById(id) // tested
//addProduct() // tested
//addCommentsToProduct() // tested
//getProductComments() // tested
//addLike() //tested
//updateStockOfProduct() // tested
//deleteProduct() // tested
//searchProduct() // tested
//filterProducts() // tested
//sortProducts() // partially tested // didnt test with different page no

let exportedMethods = {
  async getAllProducts() {
    const productCollection = await products();

    const productList = await productCollection.find({}).toArray();

    if (productList.length == 0) throw "No Book in system!";

    const result = [];

    for (let product of productList) {
      let {
        _id,
        title,
        description,
        productImage,
        noOfLikes,
        createdAt,
        stock,
        facet,
      } = product;
      _id = _id.toString();
      result.push({
        _id,
        title,
        description,
        productImage,
        noOfLikes,
        createdAt,
        stock,
        facet,
      });
    }
    return result;
  },

  async getProductById(id) {
    const productCollection = await products();
    const product = await productCollection.findOne({ _id: ObjectId(id) });
    if (!product) throw "product not found";
    product._id = product._id.toString();
    return product;
  },

  async addProduct(title, description, productImage, createdBy, stock, facet) {
    const productType = require("./index").productType;
    const productCollection = await products();
    let newProduct = {
      title: title,
      description: description,
      productImage: productImage,
      noOfLikes: 0,
      comments: [],
      likedBy: [],
      createdBy: createdBy,
      createdAt: new Date(),
      stock: stock,
      facet: facet,
    };

    const insertedInfo = await productCollection.insertOne(newProduct);
    if (insertedInfo.insertedCount === 0) throw "Insert failed!";

    if (await productType.doesProductTypeExist(facet[0]["value"])) {
      const removedProp = facet.shift();
      for (attribute of facet) {
        const newProp = {
          name: attribute.property,
          type: typeof attribute.value,
          values: [attribute.value],
        };

        if (
          await productType.doesPropertyOfProductTypeExist(
            removedProp["value"],
            newProp
          )
        ) {
          await productType.updateCountOfAPropertyforGivenType(
            removedProp["value"],
            newProp,
            true,
            stock
          );
          await productType.updateValuesOFAPropertyWithGivenType(
            removedProp["value"],
            newProp
          );
          continue;
        } else {
          await productType.updatePropertiesOfProduct(
            removedProp["value"],
            newProp,
            stock
          );
        }
      }
      await productType.updateCountOfProducts(
        removedProp["value"],
        true,
        stock
      );
    } else {
      let removedProp = facet.shift();
      await productType.addNewProductType(removedProp["value"], facet, stock);
    }

    return insertedInfo.insertedId.toString();
  },

  async addCommentsToProduct(productID, commentID) {
    const productCollection = await products();
    const updatedInfo = await productCollection.updateOne(
      {
        _id: ObjectId(productID),
      },
      {
        $push: {
          comments: ObjectId(commentID),
        },
      }
    );

    if (updatedInfo.updatedCount === 0) throw "Update failed!";
  },

  async getProductComments(productID) {
    const commentsData = require("./index").comments;
    const product = await this.getProductById(productID);
    const comments = [];
    for (comment of product.comments) {
      comments.push(await commentsData.getComment(comment.toString()));
    }
    return comments;
  },

  async addLike(productID, userID) {
    const productsCollection = await products();
    const updatedInfo = await productsCollection.updateOne(
      {
        _id: ObjectId(productID),
      },
      {
        $inc: {
          noOfLikes: 1,
        },

        $push: {
          likedBy: ObjectId(userID),
        },
      }
    );

    if (updatedInfo.updatedCount === 0) throw "Update failed to add like";

    const users = require("./index").users;

    await users.userLikesAProduct(userID, productID);
  },

  async updateStockOfProduct(productID) {
    const productType = require("./index").productType;

    const productsCollection = await products();

    const product = await this.getProductById(productID);

    if (product.stock == 1) {
      this.deleteProduct(product);
    } else {
      const updatedInfo = await productsCollection.updateOne(
        {
          _id: ObjectId(productID),
        },
        {
          $inc: {
            stock: -1,
          },
        }
      );

      if (updatedInfo.updatedCount === 0) throw " failed to update stock";

      await productType.updateCountOfProducts(
        product.facet[0]["value"],
        false,
        1
      );

      const removedProp = product.facet.shift();

      for (attribute of product.facet) {
        const newProp = {
          name: attribute.property,
          type: typeof attribute.value,
        };

        await productType.updateCountOfAPropertyforGivenType(
          removedProp["value"],
          newProp,
          false,
          1
        );
      }
    }
  },

  async deleteProduct(productID, stock = 1) {
    const productType = require("./index").productType;

    const productsCollection = await products();
    const product = await this.getProductById(productID);

    const deletedInfo = await productsCollection.deleteOne({
      _id: ObjectId(product._id),
    });
    if (deletedInfo.deletedCount === 0) throw "failed to delete a product";

    await productType.updateCountOfProducts(
      product.facet[0]["value"],
      false,
      stock
    );

    const removedProp = product.facet.shift();

    for (attribute of product.facet) {
      const newProp = {
        name: attribute.property,
        type: typeof attribute.value,
      };

      await productType.updateCountOfAPropertyforGivenType(
        removedProp["value"],
        newProp,
        false,
        stock
      );
    }

    await productType.deleteProductPropertiesWithCountZero(
      removedProp["value"]
    );
    await productType.deleteProductTypeWithCountZero();
  },

  async searchProduct(searchTerm) {
    const productsCollection = await products();

    // ref:https://docs.mongodb.com/manual/text-search/
    await productsCollection.createIndex({
      title: "text",
      description: "text",
    });

    const productsList = await productsCollection
      .find({
        $text: {
          $search: searchTerm,
        },
      })
      .toArray();

    if (productsList.length == 0)
      throw "Could not find products with the given search term";
    return productsList;
  },

  async filterProducts(properties) {
    const productsCollection = await products();

    const properiesList = [];

    for (p in properties) {
      properiesList.push({
        facet: { $elemMatch: { property: p, value: properties[p] } },
      });
    }

    const productsList = productsCollection
      .find({
        $and: properiesList,
      })
      .toArray();

    if (productsList.length == 0)
      throw "could not able to find products with such properties.";

    return productsList;
  },

  async sortProducts(sortby, pageNo) {
    const productsCollection = await products();

    let productsList = 0;

    if (sortby === "time") {
      productsList = await productsCollection
        .find({})
        .sort({ _id: 1 })
        .skip(pageNo * 20)
        .limit(20)
        .toArray();
    } else if (sortby === "likes") {
      productsList = await productsCollection
        .find({})
        .sort({ noOfLikes: -1 }) // -1 for descending order
        .skip(pageNo * 20)
        .limit(20)
        .toArray();
    } else if (sortby === "stock") {
      productsList = await productsCollection
        .find({})
        .sort({ stock: -1 }) // -1 for descending order
        .skip(pageNo * 20)
        .limit(20)
        .toArray();
    } else if (sortby === "alphabetical") {
      productsList = await productsCollection
        .find({})
        .sort({ title: 1 })
        .skip(pageNo * 20)
        .limit(20)
        .toArray();
    } else {
      throw "Invalid sortBy";
    }

    if (productsList.length == 0) throw "No Book in system!";

    const result = [];

    for (let product of productsList) {
      let {
        _id,
        title,
        description,
        productImage,
        noOfLikes,
        createdAt,
        stock,
        facet,
      } = product;
      _id = _id.toString();
      result.push({
        _id,
        title,
        description,
        productImage,
        noOfLikes,
        createdAt,
        stock,
        facet,
      });
    }
    return result;
  },
};

module.exports = exportedMethods;
