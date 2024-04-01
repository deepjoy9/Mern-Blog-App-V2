const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const {
  createPost,
  updatePost,
  getPosts,
  getPostById,
  getMyPosts,
} = require("../controllers/postController");

router.post("/", uploadMiddleware.single("file"), createPost);
router.put("/", uploadMiddleware.single("file"), updatePost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.get("/myposts/:id", getMyPosts);

module.exports = router;
