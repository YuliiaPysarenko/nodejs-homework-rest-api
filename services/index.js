const contacts = require("./contact.service");
const { authenticateUser, findUser } = require("./users.service");
const { uploadImage, updateUser } = require("./image.service");
const { sendEmail } = require("./email.service");

module.exports = { contacts, authenticateUser, uploadImage, updateUser, findUser, sendEmail };
