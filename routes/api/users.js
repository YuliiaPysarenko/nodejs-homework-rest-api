const express = require("express");
const { addUser, findUser } = require("../../controllers/users");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

// const { token, secret } = require('../../credentials/jwt');

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
      return res.status(409).json({ message: "Email is already in use" });
    }

    const contact = await addUser(email, password);
    res.status(201).json(contact);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ message: "missing required fields" });
    }

    const user = await findUser(email);

    if (!user || !user.validPassword(password)) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Incorrect login or password',
        data: 'Bad request',
      });
    }

    const payload = {
      id: user.id,
      username: user.username,
    };
  
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    res.json({
      status: 'success',
      code: 200,
      data: {
        token,
      },
    });
    
    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;