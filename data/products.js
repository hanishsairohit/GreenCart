const mongoCollections = require("../config/mongoCollections");
const products = mongoCollections.products;
const uuid = require("uuid").v4;
const { ObjectId } = require("mongodb");

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
      console.log(commentsData);
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
    const productsCollection = await products();

    const product = await this.getProductById(productID);

    if (product.stock == 1) {
      this.deleteProduct(productID);
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
    }
  },

  async deleteProduct(productID) {
    const productsCollection = await products();

    const deletedInfo = await productsCollection.deleteOne({
      _id: ObjectId(productID),
    });

    if (deletedInfo.deletedCount === 0) throw " failed to delete product";
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

    if (sortby === "time") {
      const productsList = await productsCollection
        .find({})
        .sort({ _id: 1 })
        .skip(pageNo * 20)
        .limit(20)
        .toArray();
    } else if (sortby === "likes") {
      const productsList = await productsCollection
        .find({})
        .sort({ noOfLikes: 1 })
        .skip(pageNo * 20)
        .limit(20)
        .toArray();
    } else if (sortby === "stock") {
      const productsList = await productsCollection
        .find({})
        .sort({ stock: 1 })
        .skip(pageNo * 20)
        .limit(20)
        .toArray();
    } else if (sortby === "alphabetical") {
      const productsList = await productsCollection
        .find({})
        .sort({ title: 1 })
        .skip(pageNo * 20)
        .limit(20)
        .toArray();
    } else {
      throw "Invalid sortBy";
    }

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
};

module.exports = exportedMethods;
