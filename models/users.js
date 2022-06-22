// const { v4: uuidv4 } = require("uuid");
const { Schema, model } = require("mongoose");

const bcrypt = require("bcrypt");
// const myPlaintextPassword = "s0//P4$$w0rD";
// const someOtherPlaintextPassword = "not_bacon";

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: String,
});

const Users = model("User", userSchema);

const addUser = async (email, password) => {
  try {
    const hashedPassword = bcrypt.hash(password, 10, function (err, hash) {
      if (err) {
        throw err;
      }
      return hash; // Store hash in your password DB.
    });

    const newUser = {
      email,
      password: hashedPassword,
    };

    return await Users.create(newUser).catch((err) =>
      console.log("addUser: ", err)
    );
  } catch (e) {
    console.log(e);
  }
};

const findUser = async (email) => {
    return await Users.findOne({email})
}

module.exports = {
  addUser,
  findUser
};
