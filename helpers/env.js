require('dotenv').config()
const {PORT, DB_HOST, JWT_SECRET} = process.env;

module.exports = {
    PORT, DB_HOST, JWT_SECRET,
}