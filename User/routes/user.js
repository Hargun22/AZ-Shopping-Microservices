const router = require("express").Router();
const User = require("../models/User");
const { isLoggedIn, isAdmin } = require("./verification");
const bcrypt = require("bcryptjs");

// New user
router.post("/", (req, res, next) => {
  const newUser = new User(req.body);
  newUser.save((err, user) => {
    if (err) return next(err);
    res.status(201).json(user);
  });
});

// Get all users
router.get("/", isLoggedIn, isAdmin, (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) return next(err);
    const info = users.map((user) => {
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        admin: user.admin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });
    res.status(200).json(info);
  });
});

// Get user stats
router.get("/stats", isLoggedIn, isAdmin, async (req, res, next) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: { month: { $month: "$createdAt" } },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

// Get user
router.get("/:id", (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err || !user) return next(err);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  });
});

// Update user
router.put("/:id", isLoggedIn, (req, res, next) => {
  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }
  User.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true },

    (err, user) => {
      if (err) return next(err);
      res.status(200).json(user);
    }
  );
});

// Delete user
router.delete("/:id", isLoggedIn, isAdmin, (req, res, next) => {
  User.findByIdAndDelete(req.params.id, (err, user) => {
    if (err) return next(err);
    res.status(200).json(user);
  });
});

module.exports = router;
