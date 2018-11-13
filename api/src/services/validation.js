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
  passwordConfirm: Joi.string()
    .valid(Joi.ref('password'))
    .options({
      language: {
        any: {
          allowOnly: 'doesn\'t match',
        }
      }
    })
    .required()
    .label('Password confirmation'),
  name: Joi.string()
    .max(50)
    .required()
    .label("Name")
});

module.exports = {
  validUser
};