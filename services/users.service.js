const { User } = require("../models/users");
const { JWT_SECRET } = require("../helpers/env");
const jwt = require("jsonwebtoken");

const authenticateUser = async (token) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const { id } = payload;
    const user = await User.findById(id);

    return token !== user.token ? null : user;
  } catch (e) {
    return null;
  }
};

const updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, {new: true});
}

module.exports = {
  authenticateUser, updateUser
};
