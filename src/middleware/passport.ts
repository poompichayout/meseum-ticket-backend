import User, { IUser } from '../database/models/User';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import { SECRET } from '../config';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new JWTStrategy({
		jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
		secretOrKey: SECRET,
	},
	async (jwtPayload, cb) => {
		return cb(null, jwtPayload);

		// User.findById(jwtPayload.id).lean<IUser>()
		// 	.then(userCode => {
		// 		return cb(null, userCode);
		// 	})
		// 	.catch(err => {
		// 		console.log(err)
		// 		return cb(err);
		// 	});
	}
));