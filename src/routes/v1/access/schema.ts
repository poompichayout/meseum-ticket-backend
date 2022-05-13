import Joi from 'joi';
import { JoiAuthBearer } from '../../../helpers/validator';

export default {
  userCredential: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
  refreshToken: Joi.object().keys({
    refreshToken: Joi.string().required().min(1),
  }),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
  signup: Joi.object().keys({
    firstName: Joi.string().required().min(3),
    lastName: Joi.string().required().min(3),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().options({ errors: { language: "must match password" }}),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/)
  }),
};
