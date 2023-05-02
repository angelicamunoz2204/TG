"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const travelManagementController_1 = require("../controllers/travelManagementController");
var express = require('express');
var router = express.Router();
// Require controller modules.
var travelManagementController = require('../controllers/travelManagementController');
router.get('/flights', travelManagementController_1.sendflightsInformation);
router.get('/hotels', travelManagementController_1.sendLodgingsInformation);
router.get('/all', travelManagementController_1.sendTest);
module.exports = router;
