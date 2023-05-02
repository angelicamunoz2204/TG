import { Router } from "express";
import {sendflightsInformation, sendLodgingsInformation, sendAllInformation, sendTest} from '../controllers/travelManagementController'

var express = require('express');
var router: Router = express.Router();

// Require controller modules.
var travelManagementController = require('../controllers/travelManagementController');

router.get('/flights', sendflightsInformation);

router.get('/hotels', sendLodgingsInformation);

router.get('/all', sendTest);
module.exports = router;
