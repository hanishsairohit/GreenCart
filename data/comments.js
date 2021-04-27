const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const productsData = require("./products");
const usersData = require("./users");
const { ObjectId } = require("mongodb");

async function addComment(userId, productId, commentText) {
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
