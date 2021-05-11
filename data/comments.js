const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const productsData = require("./products");
const usersData = require("./users");
const { ObjectId } = require("mongodb");
const errorHandler = require("../Error/DatabaseErrorHandling");

// functions in this file

//addComment // tested // Error Handling
//getComment // tested  // Error Handling

async function addComment(userId, productId, commentText) {
  errorHandler.checkStringObjectId(userId, "User ID");
  errorHandler.checkStringObjectId(productId, "Product ID");
  errorHandler.checkString(commentText, "Comment Text");

  let newComment = {
    userId: ObjectId(userId),
    productId: ObjectId(productId),
    commentText: commentText,
  };

  const commentCollection = await comments();
  const insertInfo = await commentCollection.insertOne(newComment);

  if (insertInfo.insertedCount === 0) throw "Could not add the comment. ";
  const newId = insertInfo.insertedId;

  await productsData.addCommentsToProduct(productId, newId.toString());
  await usersData.addCommentsToUser(userId, newId.toString());
  return newId.toString();
}

async function getComment(commentId) {
  errorHandler.checkStringObjectId(commentId, "Comment ID");
  let parsedId = ObjectId(commentId);
  const commentCollection = await comments();
  let comment = await commentCollection.findOne({ _id: parsedId });
  if (comment === null) throw "No comment with that id.";

  comment._id = comment._id.toString();
  comment.userId = comment.userId.toString();
  comment.productId = comment.productId.toString();

  return comment;
}

module.exports = {
  addComment,
  getComment,
};
