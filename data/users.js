/*
parameters:-
  "userId": "123-123-123",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "12/22/1990",
  "age": "30",
  "phoneNumber": "412-124-1253",
  "emailId": "johnDoE@gmail.com",
  "address":{
  "street":"abcde",
  "city": "NYC",
  "state": "NY",
  "code":"07307"
  }
  "profilePhoto": "/static/xyz.jpeg",
  "password": "Encrypted Password",
  "reviewsId": ["123-311-1233", "333-333-1111"]
*/
// Importing "users" collection from the database and destructuring theObjectId from mongodb
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let { ObjectId } = require("mongodb");

module.exports = {
  async addUser(
    firstName,
    lastName,
    dateOfBirth,
    age,
    phoneNumber,
    emailId,
    password,
    address,
    profilePhoto,
    reviewsId
  ) {
    // Error handling and Checking
    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !age ||
      !phoneNumber ||
      !emailId ||
      !password ||
      !address ||
      !profilePhoto ||
      !reviewsId
    )
      throw "All fields Must be provided :- addUser()";
    if (
      typeof firstName !== "string" ||
      firstName.trim().length == 0 ||
      typeof lastName !== "string" ||
      lastName.trim().length == 0 ||
      typeof dateOfBirth !== "string" ||
      dateOfBirth.trim().length == 0 ||
      typeof age !== "number" ||
      age.trim().length == 0 ||
      typeof phoneNumber !== "number" ||
      phoneNumber.trim().length == 0 ||
      typeof emailId !== "string" ||
      emailId.trim().length == 0
    )
      throw "Either provided data is not of proper type or the length of the data is zero :- addUser()";

    if (typeof address !== "object")
      throw "Address should be the type of object :-addUser()";

    street = address.street;
    city = address.city;
    state = address.state;
    code = address.code;

    if (
      typeof state !== "string" ||
      state.trim().length == 0 ||
      typeof city !== "string" ||
      city.trim().length == 0 ||
      typeof street !== "string" ||
      street.trim().length == 0 ||
      typeof code !== "string" ||
      code.trim().length == 0
    )
      throw " The provided address info is not of proper type or empty :-addUser()";
    ////////////////
    const addUser = await users();
    // storing the data into an object
    let newUser = {
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      age: age,
      phoneNumber: phoneNumber,
      emailId: emailId,
      password: password,
      address: {
        street: street,
        city: city,
        state: state,
        code: code,
      },
      profilePhoto: "path or url",
      reviewsId: [],
    };

    const insertedUser = await addUser.insertOne(newUser);
    if (insertedUser.insertedCount === 0)
      throw "Could not add User. :-addUser()";
    const newUserId = await insertedUser.insertedId;
    const addedUser = await this.getUser(newUserId);
    return addedUser;
  },
  async getUser(userId) {
    newId = ObjectId(userId);
    const userData = await users();
    const userById = await userData.findOne({ _id: newId });
    if (userById === null) throw "No user found :- getUser()";
    userById["_id"] = userById["_id"].toString();
    return userById;
  },
};
