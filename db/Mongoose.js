const mongoose = require('mongoose');

const mongoDbConnectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
};

mongoose
  .connect(
    process.env.MONGO_URI,
    mongoDbConnectionOptions,
  )
  .catch(err => {
    console.log('Error in Connection : ', err.errmsg);
  });

module.exports = { mongoose };
