const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
const productData = data.products;
const userData = data.users;
const { ObjectId } = require('mongodb');

router.get("/:id", async (req, res) => {
    try {
      const comment = await comments.getComment(req.params.id);
      res.status(200).render("comment", {commentText: comment.commentText})
    } catch (e) {
      res.status(404).json({ message: "Error: No Comment found." });
    }
});

module.exports = router;
