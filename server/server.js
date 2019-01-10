require('dotenv').config();
const express = require('express');
const _ = require('lodash');
const userModel = require('../models/UserModel');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('./db/Mongoose');

const authToken = require('./middlewares/authToken');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  const userInfo = new userModel(body);

  userInfo
    .save()
    .then(() => {
      return userInfo.generateAuthToken();
    })
    .then(token => {
      res.header('x-auth', token).send(userInfo.toJSON());
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

app.get('/users/me', authToken, (req, res) => {
  res.send(req.user);
});

app.listen(PORT, err => {
  if (err) {
    return console.log('Could not spin up the server ', err);
  }
  console.log('Server Started at ', PORT);
});
