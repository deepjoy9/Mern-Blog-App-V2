const Post = require("../models/Post.model");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

exports.createPost = async (req, res) => {
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
};

exports.updatePost = async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    await Post.findByIdAndUpdate(id, {
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });
    res.json("Post updated successfully");
  });
};

exports.getPosts = async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await Post.findById(id).populate("author", ["username"]);
    if (!postDoc) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(postDoc);
  } catch (error) {
    // Handle CastError (invalid post ID)
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Invalid post ID" });
    }
    console.error("Error fetching post by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMyPosts = async (req, res) => {
  const { id } = req.params;
  try {
    // Find all posts by the author ID
    const postDocs = await Post.find({ author: id }).populate("author", [
      "username",
    ]).sort({ createdAt: -1 });
    if (!postDocs || postDocs.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }
    res.json(postDocs);
  } catch (error) {
    console.error("Error fetching posts by author ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
