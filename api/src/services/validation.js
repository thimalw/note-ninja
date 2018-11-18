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

const validNote = Joi.object().keys({
  user: Joi.any()
    .required()
    .label("User ID"),
  title: Joi.string()
    .allow('')
    .max(400)
    .label("Title"),
  body: Joi.string()
    .allow('')
    .label("Body text"),
  excerpt: Joi.string()
    .allow('')
    .max(100)
    .label("Excerpt"),
  createdAt: Joi.any(),
  updatedAt: Joi.any(),
  __v: Joi.any()
});

module.exports = {
  validUser,
  validNote
};