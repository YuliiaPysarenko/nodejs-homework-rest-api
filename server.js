const app = require('./app')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

require('dotenv').config()
console.log(process.env)

const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_HOST;

mongoose.connect(uriDb)
  .then(() => {
    app.listen(PORT, function () {
      console.log("Database connection successful");
      console.log(`Server running. Use our API on port: ${PORT}`);
    })
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  })