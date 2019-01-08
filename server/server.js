const express = require('express');
const _ = require('lodash');
const userModel = require('../models/UserModel');
const bodyParser = require('body-parser');
const mongoose = require('../db/Mongoose');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  let userInfo = new userModel(body);

  userInfo
    .save()
    .then((doc) => {
      res.send(doc);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

app.listen(PORT, err => {
  if (err) {
    return console.log('Could not spin up the server ', err);
  }
  console.log('Server Started at ', PORT);
});
