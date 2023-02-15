const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", (req, res, next) => {
  passport.authenticate("signup", { session: false }, (err, user, info) => {
    if (err) return next(err);

    res.json({ message: "Signed up", user: req.user });
  })(req, res, next);
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err) {
        return next(new Error("An error occurred."));
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = {
          _id: user._id,
          username: user.username,
          admin: user.admin,
          email: user.email,
          createdAt: user.createdAt,
        };
        const token = jwt.sign({ user: body }, process.env.SECRETKEY, {
          expiresIn: "1d",
        });

        return res.json({ ...body, token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

// Logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    next(err);
    res.json({ message: "Logged out" });
  });
});

module.exports = router;
