const User = require("../models/users");

const addUser = async (email, password) => {
  try {
    const newUser = new User({ email });
    newUser.setPassword(password);

    return await User.create(newUser);
  } catch (e) {
    console.log(e);
  }
};

const findUser = async (email) => {
  return await User.findOne({ email });
};

module.exports = {
  addUser,
  findUser,
};
