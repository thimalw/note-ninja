// const mongoose = require('mongoose');
const User = require('../models/User');
const logger = require('../services/winston');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { makeRes, to } = require('../helpers');

const create = async (user) => {
  let err, savedUser;
  const userInstance = new User(user);
  [err, savedUser] = await to(userInstance.save());

  if (err) {
    logger.error(err);
    return makeRes(err.status, 'Unable to register new user.');
  }

  return makeRes(200, 'User registered.', {
    _id: savedUser._id,
    email: savedUser.email
  });
};

const authenticate = async ({email, password}) => {
  let err, userInfo;
  [err, userInfo] = await to(User.findOne({email}));

  if (err) {
    logger.error(err);
    return makeRes(err.status, 'Unable to authenticate.');
  }

  if (userInfo && bcrypt.compareSync(password, userInfo.password)) {
    const secret = 'SECRET_KEY'; // TODO
    const opts = {
      expiresIn: 120
    };

    const token = jwt.sign({ id: userInfo._id }, secret, opts);

    return makeRes(200, 'Authentication successful.', { token });
  }

  return makeRes(401, 'Invalid credentials.');
};

module.exports = {
  create,
  authenticate
};