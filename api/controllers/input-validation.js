const Joi = require('joi');

exports.signup = {
  failAction(request, h, err) {
    return err;
  },
  options: { abortEarly: false },
  payload: {
    firstName: Joi.string().regex(/^[a-zA-Z\s'-]{2,16}$/).required(),
    lastName: Joi.string().regex(/^[a-zA-Z\s'-]{2,32}$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^[^\s]{8,16}$/).required(),
  },
};

