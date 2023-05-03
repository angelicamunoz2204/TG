import { Aeroline } from "./models/Flights/aeroline.model";
import { Feature } from "./models/Lodgings/feature.model";
import { Policy } from "./models/Lodgings/policy.model";
export class Constants {

public static readonly aerolines: Aeroline[] = [
    { id:1, name:"Avianca" },
    { id:2, name:"LATAM Airlines" },
    { id:3, name:"Viva AIr" },
    { id:4, name:"Satena" },
    { id:5, name:"EasyFly" },
    { id:6, name:"Copa" },
    { id:7, name:"Ultra Air" },
    { id:8, name:"Wingo" }]

public static readonly agents: any[] = [
    { id:1, name:"Avianca" },
    { id:2, name:"LATAM Airlines" },
    { id:3, name:"Viva AIr" },
    { id:4, name:"Satena" },
    { id:5, name:"EasyFly" },
    { id:6, name:"Copa" },
    { id:7, name:"Ultra Air" },
    { id:8, name:"Wingo" },
    { id:9, name:"BudgetAir" },
    { id:10, name:"Trip.com" },
    { id:11, name:"travelup" },
    { id:12, name:"Expedia" },
    { id:13, name:"Opodo" },
    { id:14, name:"eDreams" },
    { id:15, name:"lastminute.com" },
    { id:16, name:"Skyscanner" },
    { id:17, name:"Mytrip" },
    { id:18, name:"GotoGate" },
    { id:19, name:"Travel2Be" },
    { id:20, name:"Travelgenio" },
    { id:21, name:"Kiwi.com" },
    { id:22, name:"Mytrip" }]

public static readonly features: Feature[] =[
    { id:2, amenity:"Kitchen" },
    { id:4, amenity:"Wifi" },
    { id:5, amenity:" Air conditioning" },
    { id:7, amenity:"Pool" },
    { id:8, amenity:" Kitchen" },
    { id:9, amenity:"Free parking on premises" },
    { id:11, amenity:"Smoking allowed" },
    { id:12, amenity:"Pets allowed" },
    { id:15, amenity:"Gym" },
    { id:16, amenity:"Breakfast" },
    { id:21, amenity:"Elevator" },
    { id:25, amenity:"Hot tub" },
    { id:27, amenity:"Indoor fireplace" },
    { id:30, amenity:"Heating" },
    { id:33, amenity:"Washer" },
    { id:34, amenity:"Dryer" },
    { id:35, amenity:"Smoke alarm" },
    { id:36, amenity:"Carbon monoxide alarm" },
    { id:41, amenity:"Shampoo" },
    { id:44, amenity:"Hangers" },
    { id:45, amenity:"Hair dryer" },
    { id:46, amenity:"Iron" },
    { id:47, amenity:"Laptop-friendly workspace" },
    { id:51, amenity:"Self check-in" },
    { id:58, amenity:"TV" },
    { id:64, amenity:"High chair" },
    { id:78, amenity:"Private bathroom" },
    { id:109, amenity:"Wide hallways" },
    { id:110, amenity:"No stairs or steps to enter" },
    { id:111, amenity:"Wide entrance for guests" },
    { id:112, amenity:"Step-free path to entrance" },
    { id:113, amenity:"Well-lit path to entrance" },
    { id:114, amenity:"Disabled parking spot" },
    { id:115, amenity:"No stairs or steps to enter" },
    { id:116, amenity:"Wide entrance" },
    { id:117, amenity:"Extra space around bed" },
    { id:118, amenity:"Accessible-height bed" },
    { id:120, amenity:"No stairs or steps to enter" },
    { id:121, amenity:"Wide doorway to guest bathroom" },
    { id:123, amenity:"Bathtub with bath chair" },
    { id:125, amenity:"Accessible-height toilet" },
    { id:127, amenity:"No stairs or steps to enter" },
    { id:128, amenity:"Wide entryway" },
    { id:136, amenity:"Handheld shower head" },
    { id:286, amenity:"Crib" },
    { id:288, amenity:"Electric profiling bed" },
    { id:289, amenity:"Mobile hoist" },
    { id:290, amenity:"Pool with pool hoist" },
    { id:291, amenity:"Ceiling hoist" },
    { id:294, amenity:"Fixed grab bars for shower" },
    { id:295, amenity:"Fixed grab bars for toilet" },
    { id:296, amenity:"Step-free shower" },
    { id:297, amenity:"Shower chair" },
    { id:347, amenity:"Piano" },
    { id:608, amenity:"Extra space around toilet" },
    { id:609, amenity:"Extra space around shower" }]

public static readonly featuresId: number[] = this.features.map(feature => feature.id)

public static readonly cancelPolicies: Policy[] =[
    { id:1, name:"CANCEL_MODERATE" },
    { id:2, name:"CANCEL_FLEXIBLE" },
    { id:3, name:"CANCEL_STRICT_14_WITH_GRACE_PERIOD" },
    { id:4, name:"CANCEL_STRICT" },
    { id:5, name:"CANCEL_BETTER_STRICT_WITH_GRACE_PERIOD" }]

public static readonly minizincDataRequirements = ["amountOfDepartureSegments","amountOfReturnSegments","amountOfLodgings","departurePricesOptions", "returnPricesOptions", "maxAmountOfDepartureSegments",
"maxAmountOfReturnSegmentsOptions","maxAmountOfFeatures","maxPrice","maxStops","maxStopsDuration","maxTotalDuration","allowAerolines","allowIntermediaries",
"timeWindowStartHours","timeWindowStartMinutes","timeWindowEndHours","timeWindowEndMinutes",
"beedrooms","beds","bathrooms","isSuperHost", "allowPolicies", "features"]

public static readonly minizincDataRequirementsLong = [0,0,0,0,0,0,
    0,0,0,0,0,0,8,0,
    10,10,10,10,
    0,0,0,0,5,15]

public static readonly minizincDataRequirementsDim = [0,0,0,0,0,0,
    0,0,0,0,0,0,1,0,
    1,1,1,1,
    0,0,0,0,1,1]

public static readonly minizincDataFlights = ["departureSegmentsId","departureSegmentsDuration","departureSegmentsStops","departureLegsDeparturesHours",
"departureLegsDeparturesMinutes", "departureLegsArrivalsHours","departureLegsArrivalsMinutes","departureLegsDepartures",
"departureLegsArrivals","departureLegsDuration","departureLegsAeroline","departureSegmentsPrices",
"departureSegmentsPricesAgents","departureSegmentsPricesCarrier","departureSegmentsAgentsScore",
"returnSegmentsId","returnSegmentsDuration","returnSegmentsStops","returnLegsDeparturesHours",
"returnLegsDeparturesMinutes", "returnLegsArrivalsHours","returnLegsArrivalsMinutes","returnLegsDepartures",
"returnLegsArrivals","returnLegsDuration","returnLegsAeroline","returnSegmentsPrices",
"returnSegmentsPricesAgents","returnSegmentsPricesCarrier","returnSegmentsAgentsScore"]

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

public static readonly minizincDataLodgingsLong = [8,8,8,
    40,40,40,
    40,20,20,
    1,40,8]

public static readonly minizincDataLodgingsDim = [1,1,1,
    1,1,1,
    1,1,1,
    2,1,1]
}