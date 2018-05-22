const Joi = require('joi');
// const Boom = require('boom');

exports.signup = {
  failAction: async (request, h, err) => err,
  options: { abortEarly: false },
  payload: {
    firstName: Joi.string()
      .regex(/^[a-zA-Z\s'-]{2,16}$/)
      .required(),
    lastName: Joi.string()
      .regex(/^[a-zA-Z\s'-]{2,32}$/)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/^[^\s]{8,16}$/)
      .required()
  }
};

exports.league = {
  failAction(request, h, err) {
    return err;
  },
  options: { abortEarly: false },
  payload: {
    name: Joi.string()
      .regex(/^[a-zA-Z\s'-]{2,32}$/)
      .required(),
    entryFee: Joi.number()
      .integer()
      .min(0)
      .max(100)
  }
};
