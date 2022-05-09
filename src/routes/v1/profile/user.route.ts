import express, { Router } from 'express';
import passport from 'passport';

const router: Router = express.Router();

/* GET user profile. */
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.send(req.user);
});

export default router