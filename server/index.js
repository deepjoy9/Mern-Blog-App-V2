// Load environment variables from .env file
require("dotenv").config();

// Import necessary packages
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connectDB");

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

// Routes import
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

// Routes Declaration
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Connect to MongoDB database
connectDB()
  .then(() => {
    // Start the Express server
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
