const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");

const upload = require("../middlewares/imageUpload")

//routes for CRUD operations on posts

//create a new post with multiple images
router.post(
  "/",
  authMiddleware.authenticate,
  upload.array("imageUrl", 6),
  postController.createPost
);

//get all posts from the user
router.get("/", authMiddleware.authenticate, postController.getAllPosts);

//retrieve a specific post by its id
router.get("/:postId", authMiddleware.authenticate, postController.getPostById);

//update a specific post by its id
router.put(
  "/:postId",
  authMiddleware.authenticate,
  upload.array("imageUrl", 6),
  postController.updatePostById
);

//delete a specific post by its
router.delete(
  "/:postId",
  authMiddleware.authenticate,
  postController.deletePost
);

//like a specific post
router.post(
  "/:postId/like",
  authMiddleware.authenticate,
  postController.likePost
);

//dislike a specific post
router.delete(
  "/:postId/dislike",
  authMiddleware.authenticate,
  postController.dislikePost
);

//create a new comment
router.post(
  "/:postId/comment",
  authMiddleware.authenticate,
  postController.createComment
);

//delete a comment
router.delete(
  "/:postId/comment/:commentId",
  authMiddleware.authenticate,
  postController.deleteComment
);

//add a nested comment to specific post by its id and parent comment id
router.post(
  "/:postId/comment/:parentId",
  authMiddleware.authenticate,
  postController.addNestedComment
);

//Get replies for a specific top-level comment
router.get(
  "/:postId/comment/:commentId/replies",
  authMiddleware.authenticate,
  postController.getRepliesForComments
);

//like a comment or reply
router.post(
  "/:postId/comment/:commentId/like",
  authMiddleware.authenticate,
  postController.likeCommentOrReply
);

//dislike a comment or reply
router.delete(
  "/:postId/comment/:commentId/dislike",
  authMiddleware.authenticate,
  postController.dislikeCommentOrReply
);

module.exports = router;
