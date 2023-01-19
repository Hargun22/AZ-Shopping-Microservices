const passport = require("passport");
const isLoggedIn = passport.authenticate("jwt", { session: false });

const isAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized" });
  }
};

module.exports = { isLoggedIn, isAdmin };
