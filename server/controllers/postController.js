const Post = require("../models/Post.model");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const secret = process.env.SECRET_KEY;

exports.createPost = async (req, res) => {
  try {
    let newPath;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    } else {
      return res.status(400).json({ error: "All sections are required !!" });
    }

    const coverImage = await uploadOnCloudinary(newPath);
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res
          .status(401)
          .json({ error: "Session expired or invalid. Please log in again." });
      }
      const { title, summary, content } = req.body;
      if (!title || !summary || !content) {
        return res.status(400).json({
          error: "All sections are required !!",
        });
      }
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: coverImage?.url || "",
        author: info.id,
      });
      res.json(postDoc);
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Server Error. Please try again later." });
  }
};

exports.updatePost = async (req, res) => {
  try {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    const coverImage = await uploadOnCloudinary(newPath);
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res
          .status(401)
          .json({ error: "Session expired or invalid. Please log in again." });
      }
      const { id, title, summary, content } = req.body;
      if (!title || !summary) {
        return res.status(400).json({
          error: "All sections are required !!",
        });
      }
      const strippedContent = content.replace(/<[^>]*>/g, "").trim();
      if (strippedContent === "" || strippedContent === "<br>") {
        return res.status(400).json({
          error: "All sections are required !!",
        });
      }
      const postDoc = await Post.findById(id);
      if (!postDoc) {
        return res.status(404).json({ error: "Post not found." });
      }
      console.log(postDoc.cover);
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res
          .status(403)
          .json({ error: "You are not the author of this post" });
      }
      await Post.findByIdAndUpdate(id, {
        title,
        summary,
        content,
        cover: coverImage?.url || postDoc.cover,
      });
      res.json("Post updated successfully");
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Server Error. Please try again later." });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Server Error" });
  }
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
    const postDocs = await Post.find({ author: id })
      .populate("author", ["username"])
      .sort({ createdAt: -1 });
    if (!postDocs || postDocs.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }
    res.json(postDocs);
  } catch (error) {
    console.error("Error fetching posts by author ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await Post.findById(id);
    if (!postDoc) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Check if the user making the request is the author of the post
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;

      // If the user is not the author of the post, return an error
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res
          .status(401)
          .json({ message: "You are not authorized to delete this post" });
      }
      // If the user is the author of the post, proceed with deletion
      await Post.findByIdAndDelete(id);
      res.json({ message: "Post deleted successfully" });
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
