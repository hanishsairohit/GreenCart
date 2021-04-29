const productType = require("../config/mongoCollections").productType;
const { ObjectId } = require("mongodb");

// Sample ProductType document

// let productType = {
//   _id: ObjectId,
//   type: "plant",
//   properties: [
//     { name: "plant_height", type: "number" },
//     { name: "plant_color", type: "string" },
//   ],
//   countOfProducts: 10,
// };

// functions in this file

//addNewProductType()
//deleteProductType()
//getProductTypes()
//updateCountOfProducts()
//doesProductTypeExist()
//updateCountOfAPropertyforGivenType()
//updatePropertiesOfProduct()
//doesPropertyOfProductTypeExist()
//deleteProductPropertiesWithCountZero()
//deleteProductTypeWithCountZero()

module.exports = exportedMethods = {
  async addNewProductType(type, properties, countOfProducts) {
    for (property of properties) {
      property["count"] = 1;
    }
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

  async deleteProductType(type) {
    const productTypeCollection = await productType();
    const deletedInfo = await productTypeCollection.deleteOne({ type: type });

    if (deletedInfo.deletedCount == 0) {
      throw "Could not able to delete the product type.";
    }
  },

  async getProductTypes() {
    const productTypeCollection = await productType();
    const productTypeData = await productTypeCollection.find({}).toArray();
    if (productTypeData.length == 0)
      throw "No productTypes in system! You may need to seed the database.";
    return productTypeData;
  },

  async updateCountOfProducts(type, increaseByOne, stock) {
    let increaseBy = 0;

    if (increaseByOne) {
      increaseBy = 1 * stock;
    } else {
      increaseBy = -1 * stock;
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

  async doesProductTypeExist(type) {
    const productTypeCollection = await productType();
    const typesList = await productTypeCollection.find({}).toArray();

    // if (typesList.length == 0)
    //   throw "No productTypes in system! You may need to seed the database.";

    for (element of typesList) {
      if (type === element.type) {
        return true;
      }
    }
    return false;
  },

  //ref:https://stackoverflow.com/a/10523963
  async updateCountOfAPropertyforGivenType(
    type,
    property,
    increaseByOne,
    stock
  ) {
    if (increaseByOne) {
      increaseBy = 1 * stock;
    } else {
      increaseBy = -1 * stock;
    }
    const productTypeCollection = await productType();

    const updatedInfo = await productTypeCollection.updateOne(
      { type: type, "properties.name": property.name },
      {
        $inc: {
          "properties.$.count": increaseBy,
        },
      }
    );
  },

  async updatePropertiesOfProduct(type, property) {
    const productTypeCollection = await productType();

    property["count"] = 1;

    const updatedInfo = await productTypeCollection.updateOne(
      {
        type: type,
      },
      {
        $push: {
          properties: property,
        },
      }
    );

    if (updatedInfo.modifiedCount === 0) {
      throw "Couldnt able to update the properties of a product.";
    }
  },

  async doesPropertyOfProductTypeExist(type, property) {
    const productTypeCollection = await productType();

    const productTypeDocument = await productTypeCollection.findOne({
      type: type,
    });

    console.log(property);

    const productPropertiesList = productTypeDocument.properties;
    console.log(productTypeDocument);

    for (prop of productPropertiesList) {
      if (prop.name == property.name && prop.type == property.type) {
        return true;
      }
    }
    return false;
  },

  async deleteProductPropertiesWithCountZero(type) {
    const productTypeCollection = await productType();
    const updatedInfo = await productTypeCollection.updateOne(
      {
        type: type,
      },
      {
        $pull: { properties: { count: 0 } }, //{ $lt: 1 }
      }
    );
    console.log(updatedInfo);
  },

  async deleteProductTypeWithCountZero() {
    const deletedInfo = await productTypeCollection.deleteMany({
      countOfProducts: 0,
    });
    console.log(deletedInfo);
  },
};
