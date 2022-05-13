import Joi from 'joi';
import { TicketPrice } from '../../../database/models/BookingTicket';
import { PaymentMethod } from '../../../database/models/Payment';

export default {
    ticket: Joi.object().keys({
    date: Joi.date().iso(),
    amount: Joi.number(),
    pricePerTicket: Joi.number().valid(...Object.values(TicketPrice).filter(x => typeof x === "number")),
    payment_method: Joi.string().valid(...Object.values(PaymentMethod)),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    email: Joi.string().required().email(),
  }),
  range: Joi.object().keys({
    range: Joi.number().required().integer().min(5),
  })
};

