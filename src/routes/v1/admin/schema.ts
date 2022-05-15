import Joi from 'joi';
import { TimeStatus } from '../../../database/models/MuseumDate';

export default {
	range: Joi.object().keys({
		range: Joi.number().integer().min(1),
	}),
	purchase_history: Joi.object().keys({
		amount: Joi.number().integer().min(1),
	}),
	meseum_date: Joi.object().keys({
		opendatetime: Joi.date().iso(),
		closedatetime: Joi.date().iso(),
		status: Joi.boolean().required(),
		label: Joi.string().valid(...Object.values(TimeStatus))
	}),
	get_date: Joi.object().keys({
		year_month: Joi.date().iso(),
	}),
};

