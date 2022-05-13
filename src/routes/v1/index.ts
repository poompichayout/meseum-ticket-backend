import express from 'express';
import signin from './access/signin';
import signup from './access/signup';
import buyTicket from './booking/buyTicket';

const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
// router.use('/', apikey);
/*-------------------------------------------------------------------------*/
router.use('/signin', signin);
router.use('/signup', signup);
router.use('/booking', buyTicket);

export default router;
