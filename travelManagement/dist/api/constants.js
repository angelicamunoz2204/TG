"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
class Constants {
}
exports.Constants = Constants;
Constants.aerolines = [
    { id: 1, name: "Avianca" },
    { id: 2, name: "LATAM Airlines" },
    { id: 3, name: "Viva AIr" },
    { id: 4, name: "Satena" },
    { id: 5, name: "EasyFly" },
    { id: 6, name: "Copa" },
    { id: 7, name: "Ultra Air" },
    { id: 8, name: "Wingo" },
];
Constants.agents = [
    { id: 1, name: "Avianca" },
    { id: 2, name: "LATAM Airlines" },
    { id: 3, name: "Viva AIr" },
    { id: 4, name: "Satena" },
    { id: 5, name: "EasyFly" },
    { id: 6, name: "Copa" },
    { id: 7, name: "Ultra Air" },
    { id: 8, name: "Wingo" },
    { id: 9, name: "BudgetAir" },
    { id: 10, name: "Trip.com" },
    { id: 11, name: "travelup" },
    { id: 12, name: "Expedia" },
    { id: 13, name: "Opodo" },
    { id: 14, name: "eDreams" },
    { id: 15, name: "lastminute.com" },
    { id: 16, name: "Skyscanner" },
    { id: 17, name: "Mytrip" },
    { id: 18, name: "GotoGate" },
    { id: 19, name: "Travel2Be" },
    { id: 20, name: "Travelgenio" },
    { id: 21, name: "Kiwi.com" },
    { id: 22, name: "Mytrip" },
];
Constants.features = [
    { id: 2, name: "Kitchen" },
    { id: 4, name: "Wifi" },
    { id: 5, name: "Air conditioning" },
    { id: 7, name: " Pool" },
    { id: 8, name: "Kitchen" },
    { id: 9, name: "Free parking on premises" },
    { id: 11, name: "Smoking allowed" },
    { id: 12, name: "Pets allowed" },
    { id: 15, name: "Gym" },
    { id: 16, name: "Breakfast" },
    { id: 21, name: "Elevator" },
    { id: 25, name: "Hot tub" },
    { id: 27, name: "Indoor fireplace" },
    { id: 30, name: "Heating" },
    { id: 33, name: "Washer" },
    { id: 34, name: "Dryer" },
    { id: 35, name: "Smoke alarm" },
    { id: 36, name: "Carbon monoxide alarm" },
    { id: 41, name: "Shampoo" },
    { id: 44, name: "Hangers" },
    { id: 45, name: "Hair dryer" },
];
Constants.cancelPolicies = [
    { id: 1, name: "CANCEL_MODERATE" },
    { id: 2, name: "CANCEL_FLEXIBLE" },
    { id: 3, name: "CANCEL_STRICT_14_WITH_GRACE_PERIOD" },
    { id: 4, name: "CANCEL_STRICT" },
    { id: 5, name: "CANCEL_BETTER_STRICT_WITH_GRACE_PERIOD" },
];
Constants.minizincDataRequirements = ["amountOfDepartureSegments", "amountOfReturnSegments", "amountOfLodgings", "departurePricesOptions", "returnPricesOptions", "maxAmountOfDepartureSegments",
    "maxAmountOfReturnSegmentsOptions", "maxAmountOfFeatures", "maxPrice", "maxStops", "maxStopsDuration", "maxTotalDuration", "allowAerolines", "allowIntermediaries",
    "timeWindowStartHours", "timeWindowStartMinutes", "timeWindowEndHours", "timeWindowEndMinutes", "minScoreFlights", "minScoreLodging",
    "beedrooms", "beds", "bathrooms", "isSuperHost", "features"];
Constants.minizincDataRequirementsLong = [0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 8, 0,
    10, 10, 10, 10, 0, 0,
    0, 0, 0, 0, 15];
Constants.minizincDataRequirementsDim = [0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 0,
    1, 1, 1, 1, 0, 0,
    0, 0, 0, 0, 1];
Constants.minizincDataFlights = ["departureSegmentsId", "departureSegmentsDuration", "departureSegmentsStops", "departureLegsDeparturesHours",
    "departureLegsDeparturesMinutes", "departureLegsArrivalsHours", "departureLegsArrivalsMinutes", "departureLegsDepartures",
    "departureLegsArrivals", "departureLegsDuration", "departureLegsAeroline", "departureSegmentsPrices",
    "departureSegmentsPricesAgents", "departureSegmentsPricesCarrier", "departureSegmentsAgentsScore",
    "returnSegmentsId", "returnSegmentsDuration", "returnSegmentsStops", "returnLegsDeparturesHours",
    "returnLegsDeparturesMinutes", "returnLegsArrivalsHours", "returnLegsArrivalsMinutes", "returnLegsDepartures",
    "returnLegsArrivals", "returnLegsDuration", "returnLegsAeroline", "returnSegmentsPrices",
    "returnSegmentsPricesAgents", "returnSegmentsPricesCarrier", "returnSegmentsAgentsScore"];
Constants.minizincDataFlightsLong = [4, 30, 30, 15,
    15, 15, 15, 3,
    3, 10, 10, 2,
    3, 3, 1,
    4, 30, 30, 15,
    15, 15, 15, 3,
    3, 10, 10, 2,
    3, 3, 1];
Constants.minizincDataFlightsDim = [1, 1, 1, 2,
    2, 2, 2, 2,
    2, 2, 2, 2,
    2, 2, 2,
    1, 1, 1, 2,
    2, 2, 2, 2,
    2, 2, 2, 2,
    2, 2, 2];
Constants.minizincDataLodgings = ["lodgingsId", "lodgingsStartDate", "lodgingsEndDate",
    "lodgingsPeople", "lodgingsBathrooms", "lodgingsBedrooms",
    "lodgingsBeds", "lodgingsIsSuperhost", "lodgingsRating",
    "lodgingsFeatures", "lodgingsCancelPolicy", "lodgingsPriceTotalAmount"];
Constants.minizincDataLodgingsLong = [8, 8, 8,
    40, 40, 40,
    40, 20, 20,
    1, 40, 8];
Constants.minizincDataLodgingsDim = [1, 1, 1,
    1, 1, 1,
    1, 1, 1,
    2, 1, 1];
