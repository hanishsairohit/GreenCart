let { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const admin = mongoCollections.admin;
const bcrypt = require("bcryptjs");
const errorHandler = require("../Error/DatabaseErrorHandling");

// functions in this file

//addAdmin() // tested //Error Handling
//getAdmin() //tested  // Error Handling
//adminAddsAProduct() // tested // Error Handling
//adminDeletesAProduct() //tested  //Error Handling

const saltNumber = 14;

module.exports = {
  async addAdmin(firstname, lastname, password, emailID) {
    errorHandler.checkString(firstname, "First Name");
    errorHandler.checkString(lastname, "Last Name");
    errorHandler.checkString(password, "Password");
    errorHandler.checkEmail(emailID, "email ID");
    errorHandler.checkPassword(password);

    const adminCollection = await admin();
    const hasedPassword = await bcrypt.hash(password, saltNumber);

    let newAdmin = {
      firstname: firstname,
      lastname: lastname,
      password: hasedPassword,
      addedProducts: [],
      emailID: emailID.toLowerCase(),
    };

    const insertedInfo = await adminCollection.insertOne(newAdmin);
    if (insertedInfo.insertedCount == 0) {
      throw "Cound not able to insert an admin.";
    }
    return insertedInfo.insertedId.toString();
  },

  async getAllAdmins() {
    const adminCollection = await admin();
    const allAdmins = await adminCollection.find({}).toArray();
    if (!allAdmins || allAdmins.length == 0) {
      console.log("admin collection is empty");
      return;
    } else {
      for (i of allAdmins) {
        i._id = i._id.toString();
      }
      return allAdmins;
    }
  },

  async getAdmin(adminId) {
    errorHandler.checkStringObjectId(adminId, "Admin Id");
    const adminCollection = await admin();

    const adminInfo = await adminCollection.findOne({ _id: ObjectId(adminId) });
    if (!adminInfo) {
      throw "Could not find an admin with the given ID";
    }
    return adminInfo;
  },

  async adminAddsAProduct(productId, AdminId) {
    errorHandler.checkStringObjectId(productId, "Product Id");
    errorHandler.checkStringObjectId(AdminId, "Admin Id");
    const adminCollection = await admin();
    const updatedInfo = await adminCollection.updateOne(
      { _id: ObjectId(AdminId) },
      {
        $push: {
          addedProducts: ObjectId(productId),
        },
      }
    );

    if (updatedInfo.updatedCount === 0)
      throw " failed to update admin added products";
  },

  async adminDeletesAProduct(productId, AdminId) {
    errorHandler.checkStringObjectId(productId, "Product Id");
    errorHandler.checkStringObjectId(AdminId, "Admin Id");
    const adminCollection = await admin();
    const updatedInfo = await adminCollection.updateOne(
      { _id: ObjectId(AdminId) },
      {
        $pull: {
          addedProducts: ObjectId(productId),
        },
      }
    );
    if (updatedInfo.updatedCount === 0)
      throw " failed to update admin added products";
  },
};
