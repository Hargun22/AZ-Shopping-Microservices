const router = require("express").Router();
const { isLoggedIn, isAdmin } = require("../utils/verification");

const {
  postUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getStats,
} = require("../controller/user_controller");

// New user
router.post("/", postUser);

// Get all users
router.get("/", isLoggedIn, isAdmin, getAllUsers);

// Get user
router.get("/:id", getUser);

// Update user
router.put("/:id", isLoggedIn, updateUser);

// Delete user
router.delete("/:id", isLoggedIn, isAdmin, deleteUser);

// Get user stats
router.get("/stats", isLoggedIn, isAdmin, getStats);

module.exports = router;
