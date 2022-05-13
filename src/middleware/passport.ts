import User from '../database/models/User';
import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import { SECRET } from 'src/config';

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, async (email: string, password: string, cb) => {
	
	return User.findOne({ email, password })
		.then(user => {
			if (!user) {
				cb(null, false, { message: 'Incorrect email or password.' })
			}

			return cb(null, user, { message: 'Logged In Successfully' })
		})
		.catch(err => cb(err))
}));

passport.use(new JWTStrategy({
		jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
		secretOrKey: SECRET
	},
	async (jwtPayload, cb) => {
	//find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
		
	return User.findById(jwtPayload.id)
		.then(user => {
			return cb(null, user);
		})
		.catch(err => {
			return cb(err);
		});
	}
));