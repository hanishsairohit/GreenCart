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
const errorHandle = require("./errorHandle");
const bcrypt = require("bcryptjs");
let saltNumber = 14;

module.exports = {
  async addUser(
    firstName,
    lastName,

    age,
    phoneNumber,
    emailId,
    password,
    address,
    profilePhoto,
    reviewsId
  ) {
    // Error handling and Checking

    if (!errorHandle.stringCheck(firstName))
      throw "Provided first name is not proper!";
    if (!errorHandle.stringCheck(lastName))
      throw "Provided last name is not proper!";
    if (!errorHandle.emailValidate(emailId))
      throw " Provided emailId is not valid!";
    if (!errorHandle.validPassword(password))
      throw " Provided password is not valid!";
    if (!errorHandle.phoneNumberValid(phoneNumber))
      throw "Provided phone number is not valid";
    if (!errorHandle.ageValid(age)) throw "Age is not valid!";

    //
    if (typeof address !== "object")
      throw "Address should be the type of object :-addUser()";

    street = address.street;
    city = address.city;
    state = address.state;
    code = address.code;

    if (!errorHandle.stringCheck(street)) throw "Street name is not valid!";
    if (!errorHandle.stringCheck(city)) throw "City name is not valid!";
    if (!errorHandle.stringCheck(state)) throw "State name is not valid!";
    if (!errorHandle.zipcCodeValid(code)) throw "Zip code is not valid!";
    // Checking if the email/userName is already used;
    const allUser = await this.getAllUsers();
    // converting email into lower case
    let propEmail = emailId.toLowerCase();
    allUser.forEach((element) => {
      if (element.emailId == propEmail)
        throw "Sorr but email is already in use";
    });

    ////////////////
    //Encrypt the password
    const hasedPassword = await bcrypt.hash(password, saltNumber);
    ////////////////

    // storing the data into an object
    let newUser = {
      firstName: firstName,
      lastName: lastName,

      age: age,
      phoneNumber: phoneNumber,
      emailId: propEmail,
      password: hasedPassword,
      address: {
        street: street,
        city: city,
        state: state,
        code: code,
      },
      profilePhoto: profilePhoto,
      reviewsId: [],
    };
    const addUser = await users();
    const insertedUser = await addUser.insertOne(newUser);
    if (insertedUser.insertedCount === 0)
      throw "Could not add User. :-addUser()";
    const newUserId = await insertedUser.insertedId;
    const addedUser = await this.getUser(newUserId.toString());
    return addedUser;
  },
  async getUser(userId) {
    if (!errorHandle.stringId(userId)) throw "Id is not valid string!";

    newId = ObjectId(userId.trim());
    const userData = await users();
    const userById = await userData.findOne({ _id: newId });
    if (userById === null) throw "No user found :- getUser()";
    userById["_id"] = userById["  _id"].toString();
    return userById;
  },
  async getAllUsers() {
    const allUsers = await users();
    const usersCollection = await allUsers.find({}).toArray();
    if (usersCollection.length === 0 || usersCollection.length === undefined) {
      return "Users Data is empty. :- getAllUsers()";
    } else {
      for (let i of usersCollection) {
        i._id = i._id.toString();
      }
      return usersCollection;
    }
  },
};
