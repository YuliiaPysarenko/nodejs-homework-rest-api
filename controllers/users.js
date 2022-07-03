const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { User } = require("../models/users");
const { JWT_SECRET } = require("../helpers/env");
const { v4: uuidv4 } = require("uuid");
const { uploadImage, sendEmail } = require("../services");
const { updateUser, findUser } = require("../services/users.service");

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await User.findOne({ email });
    if (result) {
      return res.status(409).json({ message: "Email is already in use." });
    }
    const verificationToken = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const profileUrl = await gravatar.profile_url(email);

    const user = { email, password: hashedPassword, avatarURL: profileUrl, verificationToken };

    await User.create(user);
    await sendEmail(user.email, user.verificationToken);

    res.status(201).json({
      email: user.email,
      subscription: user.subscription,
      id: user._id,
    });
  } catch (e) {
    next(e);
  }
};

const confirmEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    console.log(verificationToken);
    const user = await findUser({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await updateUser(user._id, { verify: true, verificationToken: null });
    return res.status(200).json({
      code: 200,
      message: "Email was confirmed",
    });
  } catch (e) {
    next(e);
  }
};



const resend = async (req, res, next) => {
  try {
      const {email} = req.body;
      const user = await findUser({email});
      if(!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if(user.verify) {
          return res.status(400).json({ message: "Verification has already been passed"});
      }
      await sendEmail(user.email, user.verificationToken);
      return res.status(200).json({
          code: 200,
          message: 'Verification email sent'
      });
  } catch (e) {
      next(e);
  }
}

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const payload = {
      id: user._id,
      email: user.email,
      subscription: user.subscription,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "3h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({
      token,
      user: payload,
    });
  } catch (e) {
    next(e);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { token: null });
    res.sendStatus(204);
  } catch (e) {
    res.status(401).json({ message: "Not authorized" });
    next(e);
  }
};

const currentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({ email, subscription });
  } catch (e) {
    res.status(401).json({ message: "Not authorized" });
    next(e);
  }
};

const subscriptionUpdate = async (req, res, next) => {
  try {
    const { email } = req.user;
    const user = await User.findOne({ email });
    const updatedUser = await User.findByIdAndUpdate(user._id, {
      subscription: "pro",
    });
    res.status(200).json({
      message: `Congrats! You subscription plan is ${updatedUser.subscription} now.`,
    });
  } catch (e) {
    res.status(401).json({ message: "Not authorized" });
    next(e);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { _id: id } = req.user;
    const avatarURL = await uploadImage(id, req.file);
    await updateUser(id, { avatarURL });

    res.json({ avatarURL });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

module.exports = {
  registerUser,
  loginUser,
  subscriptionUpdate,
  resend,
  logoutUser,
  currentUser,
  updateAvatar,
  confirmEmail,
};
