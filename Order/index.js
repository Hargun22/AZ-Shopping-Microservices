const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const orderRoutes = require("./routes/order");
const passport = require("passport");
const cors = require("cors");
require("./auth/authStrategies");

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("Error connecting to database");
    } else {
      console.log("Connected to database");
    }
  }
);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use("/", orderRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(req.status || 500).json({ message: err.message });
});

app.listen(process.env.PORT || 5004, () => {
  console.log(`Listening on port ${process.env.PORT || 5004}`);
});