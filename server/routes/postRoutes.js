const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const {
  createPost,
  updatePost,
  getPosts,
  getPostById,
  getMyPosts,
  deletePost,
} = require("../controllers/postController");

// Route for creating a new post
router.post("/", uploadMiddleware.single("file"), createPost);

// Route for updating an existing post
router.put("/", uploadMiddleware.single("file"), updatePost);

// Route for getting all posts
router.get("/", getPosts);

// Route for getting a specific post by ID
router.get("/:id", getPostById);

// Route for getting posts of a specific user
router.get("/myposts/:id", getMyPosts);

// Route for deleting a post by ID
router.delete("/:id", deletePost);

module.exports = router;
