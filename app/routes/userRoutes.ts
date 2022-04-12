import express, { Router } from 'express';
import { signin, signup } from '../controllers/user';

const router: Router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);

export default router