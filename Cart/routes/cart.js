const router = require("express").Router();
const Cart = require("../models/Cart");
const { isLoggedIn, isAdmin } = require("./verification");

// Get all carts
router.get("/", isLoggedIn, isAdmin, (req, res, next) => {
  Cart.find({}, (err, carts) => {
    if (err) return next(err);
    res.status(200).json(carts);
  });
});

//Get User Cart
router.get("/:userId", isLoggedIn, (req, res, next) => {
  Cart.findOne({ userId: req.params.userId }, (err, cart) => {
    if (err) return next(err);
    res.status(200).json(cart);
  });
});

// Create new cart
router.post("/", isLoggedIn, (req, res, next) => {
  const newCart = new Cart(req.body);
  newCart.save((err, cart) => {
    if (err) return next(err);
    res.status(200).json(cart);
  });
});

// Update cart
router.put("/:userId", isLoggedIn, (req, res, next) => {
  Cart.findByIdAndUpdate(
    req.params.userId,
    {
      $set: req.body,
    },
    { new: true },

    (err, cart) => {
      if (err) return next(err);
      res.status(200).json(cart);
    }
  );
});

// Delete cart
router.delete("/:userId", isLoggedIn, (req, res, next) => {
  Cart.findByIdAndDelete(req.params.userId, (err, cart) => {
    if (err) return next(err);
    res.status(200).json(cart);
  });
});
module.exports = router;
