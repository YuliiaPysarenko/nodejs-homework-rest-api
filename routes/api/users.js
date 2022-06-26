const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser
} = require("../../controllers/users");
const { authCheck, validateRequest } = require("../../middlewares");
const { schema } = require("../../models/users");

const router = express.Router();

router.post("/register", validateRequest(schema), registerUser);
router.post("/login", validateRequest(schema), loginUser);
router.post("/logout", authCheck, logoutUser);
router.get("/current", authCheck, currentUser);

module.exports = router;
