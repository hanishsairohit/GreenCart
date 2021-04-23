const mongoCollections = require('../config/mongoCollections');
const products = mongoCollections.products;
const uuid = require('uuid').v4;

let exportedMethods = {
  async getAllProducts() {
    const productCollection = await products();
    const productList = await productCollection.find({}).toArray();
    if (!productList) throw 'No Book in system!';
    const result = []
    for (let product of productList) {
      const { _id, title, description, productImage, noOfLikes, comments, likedBy, createdBy, createdAt } = product;
      result.push({ _id, title, description, productImage, noOfLikes, comments, likedBy, createdBy, createdAt })
    }
    return result;
  },

  async getProductById(id) {
    const productCollection = await products();
    ObjectId = require('mongodb').ObjectID;
    if (!id) {
      throw "You must insert id"
    }
    const product = await productCollection.findOne({ _id: ObjectId(id) });
    if (!product) throw 'product not found';
    return product;
  },

  async addProducts(title, description, productImage, noOfLikes, comments, likedBy, createdBy, createdAt) {
    const productCollection = await products();
    let newProduct = {
      title: title,
      description: description,
      productImage: productImage,
      noOfLikes: noOfLikes,
      comments: comments,
      likedBy: likedBy,
      createdBy: createdBy,
      createdAt: createdAt
    };
    const newInsertInformation = await productCollection.insertOne(newProduct);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
    ObjectId = require('mongodb').ObjectID;
    return await productCollection.findOne({ _id: ObjectId(newInsertInformation.insertedId) });
  },


};

module.exports = exportedMethods;