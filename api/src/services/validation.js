const Joi = require('joi');

const validUser = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required()
    .label("Email"),
  password: Joi.string()
    .min(8)
    .required()
    .label("Password"),
  name: Joi.string()
    .max(50)
    .required()
    .label("Name")
});

module.exports = {
  validUser
};