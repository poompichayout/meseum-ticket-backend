import express from 'express';
import signin from './access/signin';
import signup from './access/signup';
import buyTicket from './booking/buyTicket';
import getDateAvailable from './booking/getDateAvailable';
import ticketList from './profile/ticketInfo';
import statistics from './admin/statistics';
import ticketPurchaseHistory from './admin/ticketPurchaseHistory';
import getMuseumDate from './admin/getMuseumDate';
import setMuseumDate from './admin/setMuseumDate';

const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
// router.use('/', apikey);
/*-------------------------------------------------------------------------*/
router.use('/signin', signin);
router.use('/signup', signup);
router.use('/booking', buyTicket);
router.use('/booking', getDateAvailable);
router.use('/profile', ticketList);
router.use('/admin', statistics);
router.use('/admin', ticketPurchaseHistory);
router.use('/admin', getMuseumDate);
router.use('/admin', setMuseumDate);

export default router;
