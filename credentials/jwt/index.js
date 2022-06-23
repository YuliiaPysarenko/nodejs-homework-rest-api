const jwt = require("jsonwebtoken");

// const getToken = (user) => {
const secret = process.env.JWT_SECRET;

const payload = {
  userId: "Yuliia",
  admin: false,
};

const token = jwt.sign(payload, secret, { expiresIn: "1h" });
console.log(token);
// }

// jwt.verify(token, secret)
// const decode = jwt.decode(token);

module.exports = {
    token, secret
}