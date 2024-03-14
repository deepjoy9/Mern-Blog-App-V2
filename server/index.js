require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connectDB");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

connectDB()
  .then(() => {
    app.listen(4000, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
