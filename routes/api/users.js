const express = require("express");
const { addUser, findUser } = require("../../models/users");

const router = express.Router();
const Joi = require("joi");

const schema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().min(5).required(),
});

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "missing required fields" });
    }

    const user = await findUser(email);
    if (user) {
      return res.status(409).json({
        status: "error",
        code: 409,
        message: "Email is already in use",
        data: "Conflict",
      });
    }

    const contact = await addUser(email, password);
    res.status(201).json(contact);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;