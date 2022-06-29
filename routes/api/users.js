const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  subscriptionUpdate,
  updateAvatar
} = require("../../controllers/users");
const { authCheck, validateRequest } = require("../../middlewares");
const upload = require("../../middlewares/upload");
const { schema } = require("../../models/users");

const router = express.Router();

router.post("/register", validateRequest(schema), registerUser);
router.post("/login", validateRequest(schema), loginUser);
router.post("/logout", authCheck, logoutUser);
router.get("/current", authCheck, currentUser);
router.patch("/avatars", authCheck, upload.single('avatar'), updateAvatar);
router.patch("/", authCheck, subscriptionUpdate);

module.exports = router;
