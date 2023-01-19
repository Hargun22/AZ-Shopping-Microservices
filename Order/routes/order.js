const router = require("express").Router();
const Order = require("../models/Order");
const { isLoggedIn, isAdmin } = require("./verification");

// Get all orders
router.get("/", isLoggedIn, isAdmin, (req, res, next) => {
  Order.find({}, (err, orders) => {
    if (err) return next(err);
    res.status(200).json(orders);
  });
});

//Get Stats
router.get("/income", isLoggedIn, isAdmin, (req, res, next) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  Order.aggregate(
    [
      { $match: { createdAt: { $lte: lastMonth, $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ],
    (err, result) => {
      if (err) return next(err);
      res.status(200).json(result);
    }
  );
});

//Get User Order
router.get("/:userId", isLoggedIn, (req, res, next) => {
  Order.find({ userId: req.params.userId }, (err, orders) => {
    if (err) return next(err);
    res.status(200).json(orders);
  });
});

// Create new Order
router.post("/", isLoggedIn, (req, res, next) => {
  const newOrder = new Order(req.body);
  newOrder.save((err, order) => {
    if (err) return next(err);
    res.status(200).json(order);
  });
});

// Update Order
router.put("/:userId", isLoggedIn, isAdmin, (req, res, next) => {
  Order.findByIdAndUpdate(
    req.params.userId,
    {
      $set: req.body,
    },
    { new: true },

    (err, order) => {
      if (err) return next(err);
      res.status(200).json(order);
    }
  );
});

// Delete Order
router.delete("/:userId", isLoggedIn, isAdmin, (req, res, next) => {
  Order.findByIdAndDelete(req.params.userId, (err, order) => {
    if (err) return next(err);
    res.status(200).json(order);
  });
});
module.exports = router;
