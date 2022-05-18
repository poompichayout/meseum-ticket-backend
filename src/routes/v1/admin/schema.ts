import Joi from 'joi';
import { TimeStatus } from '../../../database/models/MuseumDate';

export default {
	range: Joi.object().keys({
		range: Joi.number().integer().min(1).required(),
	}),
	purchase_history: Joi.object().keys({
		range: Joi.number().integer().min(1).required(),
		limit: Joi.number().integer().min(1),
	}),
	museum_date: Joi.array().items(Joi.object().keys({
		datetime: Joi.date().iso(),
		status: Joi.string().valid(...Object.values(TimeStatus))
	})),
	get_date: Joi.object().keys({
		year: Joi.number().min(2021).max(2025),
		month: Joi.number().min(1).max(12),
	}),
};

