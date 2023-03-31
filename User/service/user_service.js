//const User = require("../models/User");
const { pool } = require("../db");

const createUser = async (userBody) => {
  try {
    const { username, password, email, admin } = userBody;
    await pool.query(
      "INSERT INTO users (username, password, email, admin) VALUES ($1, $2, $3, $4)",
      [username, password, email, admin]
    );
    const newUser = await pool.query(
      " SELECT * FROM users WHERE username = $1",
      [username]
    );
    //await new User(userBody).save();

    return newUser.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchAllUsers = async () => {
  try {
    const users = await pool.query(
      "SELECT id as _id, username, email, admin, createdat, updatedat FROM users"
    ); //await User.find({});
    // const info = users.rows.map((user) => {
    //   return {
    //     _id: user.id,
    //     username: user.username,
    //     email: user.email,
    //     admin: user.admin,
    //     createdAt: user.createdat,
    //     updatedAt: user.updatedat,
    //   };
    // });
    return users.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchUser = async (id) => {
  try {
    const user = await pool.query(
      "SELECT id as _id, username, email, admin, createdat, updatedat FROM users WHERE id = $1",
      [id]
    );
    //User.find({ username });
    if (!user.rows[0]) {
      throw new Error("User not found");
    }

    return user.rows[0];
  } catch (err) {
    throw new Error(err.message);
  }
};

const fetchUserWithName = async (username) => {
  try {
    const user = await pool.query(
      "SELECT id as _id, username, password, email, admin, createdat, updatedat FROM users WHERE username = $1",
      [username]
    );
    //User.find({ username });
    if (!user.rows[0]) {
      throw new Error("User not found");
    }

    return user.rows[0];
  } catch (err) {
    throw new Error(err.message);
  }
};

const update = async (id, updatedInfo) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const oldUser = user.rows[0];

    const newUsername = updatedInfo.username
      ? updatedInfo.username
      : oldUser.username;
    const newPassword = updatedInfo.password
      ? updatedInfo.password
      : oldUser.password;
    const newEmail = updatedInfo.email ? updatedInfo.email : oldUser.email;
    const newAdmin = updatedInfo.admin ? updatedInfo.admin : oldUser.admin;
    console.log(newPassword);
    const newUser = await pool.query(
      "UPDATE users SET username = $1, password = $2, email = $3, admin = $4 WHERE id = $5 RETURNING id as _id, username, email, admin, createdat, updatedat",
      [newUsername, newPassword, newEmail, newAdmin, id]
    );
    // await User.findByIdAndUpdate(
    //   id,
    //   {
    //     $set: updatedInfo,
    //   },
    //   { new: true }
    // );
    return newUser.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteUser = async (id) => {
  try {
    const user = await pool.query(
      "SELECT id as _id, username, email, admin, createdat, updatedat FROM users WHERE id = $1",
      [id]
    );

    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    //await User.findByIdAndDelete(id);

    return user.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

// const getUserStats = async (lastDate) => {
//   try {
//     const data = await User.aggregate([
//       { $match: { createdAt: { $gte: lastDate } } },
//       {
//         $project: { month: { $month: "$createdAt" } },
//       },
//       {
//         $group: {
//           _id: "$month",
//           total: { $sum: 1 },
//         },
//       },
//     ]);
//     return data;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

module.exports = {
  createUser,
  fetchAllUsers,
  fetchUser,
  update,
  deleteUser,
  fetchUserWithName,
};
