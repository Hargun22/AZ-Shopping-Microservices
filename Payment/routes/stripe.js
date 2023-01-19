const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment", (req, res, next) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "cad",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        return next(stripeErr);
      }
      res.status(200).json(stripeRes);
    }
  );
});

module.exports = router;
