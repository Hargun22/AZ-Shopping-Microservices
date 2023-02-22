const User = require("../models/User");

const createUser = async (userBody) => {
  try {
    const newUser = await new User(userBody).save();
    return newUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchAllUsers = async () => {
  try {
    const users = await User.find({});
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
    return info;
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchUser = async (username) => {
  try {
    const user = User.find({ username });
    if (!user[0]) {
      throw new Error("User not found");
    }
    return user[0]._doc;
  } catch (err) {
    throw new Error(err.message);
  }
};

const update = async (id, updatedInfo) => {
  try {
    const newUser = await User.findByIdAndUpdate(
      id,
      {
        $set: updatedInfo,
      },
      { new: true }
    );
    return newUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteUser = async (id) => {
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    const { password, ...others } = deletedUser;
    return others;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserStats = async (lastDate) => {
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastDate } } },
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
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createUser,
  fetchAllUsers,
  fetchUser,
  update,
  deleteUser,
  getUserStats,
};
