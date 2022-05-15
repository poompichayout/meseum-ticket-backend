import Joi from 'joi';

export default {
  ticket_params: Joi.object().keys({
    ticket_id: Joi.string().pattern(/T\d{2}-\d{5}/),
  }),
};
