import { Router } from "express";
import {sendflightsInformation, sendLodgingsInformation, sendAllInformation} from '../controllers/travelManagementController'

var express = require('express');
var router: Router = express.Router();

// Require controller modules.
var travelManagementController = require('../controllers/travelManagementController');

router.get('/flights', sendflightsInformation);

router.get('/hotels', sendLodgingsInformation);

router.get('/all', sendAllInformation);
module.exports = router;
