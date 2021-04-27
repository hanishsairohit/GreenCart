const productType = require("../config/mongoCollections").productType;
const productsData = require("./products");
const usersData = require("./users");
const { ObjectId } = require("mongodb");

let productType = {
  _id: ObjectId,
  type: "plant",
  properties: [
    { name: "plant_height", type: "number" },
    { name: "plant_color", type: "string" },
  ],
  countOfProducts: 10,
};

let exportedMethods = {
  async addNewProductType(type, properties, countOfProducts) {
    let newProductType = {
      _id: ObjectId(),
      type: type,
      properties: properties,
      countOfProducts: countOfProducts,
    };
    const productTypeCollection = await productType();
    const insertedInfo = await productTypeCollection.insertOne(newProductType);

    if (insertedInfo.insertedCount === 0)
      throw "Could not add the productType. ";
    const newId = insertedInfo.insertedId;
    return newId.toString();
  },

  async getProductTypes() {
    const productTypeCollection = await productType();
    const productTypeData = await productTypeCollection.find({}).toArray();
    if (productTypeData.length == 0)
      throw "No productTypes in system! You may need to seed the database.";
    return productTypeData;
  },

  async updateCountOfProducts(type, increaseByOne) {
    const increaseBy;

    if (increaseByOne) {
      increaseBy = 1;
    } else {
      increaseBy = -1;
    }
    const productTypeCollection = await productType();
    const updatedInfo = await productTypeCollection.updateOne(
      { type: type },
      {
        $inc: {
          countOfProducts: increaseBy,
        },
      }
    );
    if (updatedInfo.updatedCount === 0)
      throw " failed to update countOfproducts";
  },

  // yet to implement
  async doesProductTypeExist(type) {
    const productTypeCollection = await productType();
    const typesList = await productTypeCollection
      .find({}, { type: 1 })
      .toArray();

    console.log(typesList);

    if (productTypeData.length == 0)
      throw "No productTypes in system! You may need to seed the database.";
  },

  //yet to implement
  async updatePropertiesOfProduct(type, properies) {},
  //yet to implement
  async doesPropertyOfProductTypeExist(type, property) {},
  // link all these functions to db functions in products.js
};
