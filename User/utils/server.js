const express = require("express");
const userRoutes = require("../routes/user");
const passport = require("passport");
const cors = require("cors");

function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(passport.initialize());

  app.use("/", userRoutes);

  app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ message: err.message });
  });

  return app;
}

module.exports = { createServer };
