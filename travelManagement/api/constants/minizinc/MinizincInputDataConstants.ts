export class MinizincInputDataConstants {

    public static readonly minizincDataRequirements = ["amountOfDepartureSegments","amountOfReturnSegments","departurePricesOptions", "returnPricesOptions", "maxAmountOfDepartureSegments",
        "maxAmountOfReturnSegmentsOptions","amountOfLodgings","maxAmountOfFeatures","maxPrice","maxStops","maxStopsDuration","maxTotalDuration","allowAerolines","allowIntermediaries",
        "timeWindowStartHours","timeWindowStartMinutes","timeWindowEndHours","timeWindowEndMinutes",
        "beedrooms","beds","bathrooms","isSuperHost", "allowPolicies", "features"]

    public static readonly minizincDataRequirementsLong = [0,0,0,0,0,
        0,0,0,0,0,0,0,8,0,
        10,10,10,10,
        0,0,0,0,5,15]

    public static readonly minizincDataRequirementsDim = [0,0,0,0,0,0,
        0,0,0,0,0,0,1,0,
        1,1,1,1,
        0,0,0,0,1,1]

    public static readonly minizincDataFlights = ["departureSegmentsId","departureSegmentsDuration","departureSegmentsStops","departureLegsDeparturesHours",
        "departureLegsDeparturesMinutes", "departureLegsArrivalsHours","departureLegsArrivalsMinutes","departureLegsDepartures",
        "departureLegsArrivals","departureLegsDuration","departureLegsAeroline","departureSegmentsPrices",
        "departureSegmentsPricesAgents","departureSegmentsPricesIsCarrier","departureSegmentsAgentsScore",
        "returnSegmentsId","returnSegmentsDuration","returnSegmentsStops","returnLegsDeparturesHours",
        "returnLegsDeparturesMinutes", "returnLegsArrivalsHours","returnLegsArrivalsMinutes","returnLegsDepartures",
        "returnLegsArrivals","returnLegsDuration","returnLegsAeroline","returnSegmentsPrices",
        "returnSegmentsPricesAgents","returnSegmentsPricesIsCarrier","returnSegmentsAgentsScore"]

    public static readonly minizincDataFlightsLong = [4,30,30,15,
        15,15,15,3,
        3,10,10,2,
        3,3,1,
        4,30,30,15,
        15,15,15,3,
        3,10,10,2,
        3,3,1]

    public static readonly minizincDataFlightsDim =  [1,1,1,2,
        2,2,2,2,
        2,2,2,2,
        2,2,2,
        1,1,1,2,
        2,2,2,2,
        2,2,2,2,
        2,2,2]

    public static readonly minizincDataLodgings = ["lodgingsId", "lodgingsStartDate", "lodgingsEndDate", 
        "lodgingsPeople", "lodgingsBathrooms", "lodgingsBedrooms", 
        "lodgingsBeds", "lodgingsIsSuperhost", "lodgingsRating", 
        "lodgingsFeatures", "lodgingsCancelPolicy", "lodgingsPriceTotalAmount"]

    public static readonly minizincDataLodgingsLong = [5,10,10,
        10,10,10,
        10,10,10,
        1,10,10]

    public static readonly minizincDataLodgingsDim = [1,1,1,
        1,1,1,
        1,1,1,
        2,1,1]
}