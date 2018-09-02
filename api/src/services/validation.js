const Joi = require('joi');

const validUser = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required()
    .label("Email"),
  password: Joi.string()
    .min(8)
    .label("Password"),
  firstName: Joi.string()
    .alphanum()
    .max(30)
    .required()
    .label("First name"),
  lastName: Joi.string()
    .alphanum()
    .max(30)
    .label("Last name")
});

module.exports = {
  validUser
};