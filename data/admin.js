let { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const admin = mongoCollections.admin;

// functions in this file

//addAdmin()
//getAdmin()
//adminAddsAProduct()
//adminDeletesAProduct()

module.exports = {
  async addAdmin(firstname, lastname, password, addedProducts, emailID) {
    const adminCollection = await admin();

    let newAdmin = {
      firstname: firstname,
      lastname: lastname,
      password: password,
      addedProducts: addedProducts,
      emailID: emailID,
    };

    const insertedInfo = await adminCollection.insertOne(newAdmin);
    if (insertedInfo.insertedCount == 0) {
      throw "Cound not able to insert an admin.";
    }
    return insertedInfo.insertedId.toString();
  },

  async getAdmin(adminId) {
    const adminCollection = await admin();

    const adminInfo = await adminCollection.findOne({ _id: ObjectId(adminId) });
    if (!adminInfo) {
      throw "Could not find an admin with the given ID";
    }
    return adminInfo;
  },

  async adminAddsAProduct(productId, AdminId) {
    const adminCollection = await admin();
    const updatedInfo = await adminCollection.updateOne(
      { _id: AdminId },
      {
        $push: {
          addedProducts: productId,
        },
      }
    );

    if (updatedInfo.updatedCount === 0)
      throw " failed to update admin added products";
  },

  async adminDeletesAProduct(productId, AdminId) {
    const adminCollection = await admin();
    const updatedInfo = await adminCollection.updateOne(
      { _id: AdminId },
      {
        $pull: {
          addedProducts: productId,
        },
      }
    );
    if (updatedInfo.updatedCount === 0)
      throw " failed to update admin added products";
  },
};
