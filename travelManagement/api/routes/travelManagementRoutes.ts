import { Router } from 'express';
import { sendFlightsInformation } from '../controllers/flightsController';
import { sendLodgingsInformation } from '../controllers/lodgingsController';
import { sendAllInformation } from '../controllers/allController';

var express = require('express');
var router: Router = express.Router();

router.get('/flights', sendFlightsInformation);

router.get('/hotels', sendLodgingsInformation);

router.get('/all', sendAllInformation);
module.exports = router;
