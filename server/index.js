require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connectDB");

const app = express();

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

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
