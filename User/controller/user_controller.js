const UserService = require("../service/user_service");
const bcrypt = require("bcryptjs");
const CustomError = require("../utils/createError");

const postUser = async (req, res, next) => {
  try {
    const newUser = await UserService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await UserService.fetchAllUsers();
    res.status(200).json(allUsers);
  } catch (error) {
    if (error.statusCode) {
      next(error);
    } else {
      next(new CustomError(error.message, 404));
    }
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await UserService.fetchUser(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    if (error.statusCode) {
      next(error);
    } else {
      next(new CustomError(error.message, 404));
    }
  }
};

const updateUser = async (req, res, next) => {
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updatedUser = await UserService.update(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.statusCode) {
      next(error);
    } else {
      next(new CustomError(error.message, 404));
    }
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await UserService.deleteUser(req.params.id);
    res.status(200).json(deletedUser);
  } catch (error) {
    if (error.statusCode) {
      next(error);
    } else {
      next(new CustomError(error.message, 404));
    }
  }
};

const getStats = async (req, res, next) => {
  try {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    const data = await UserService.getUserStats(lastYear);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getStats,
};
