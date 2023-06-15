% Use this editor as a MiniZinc scratch bookW
include "globals.mzn";
%%include "modelInputData.dzn";

%%sets
%%Flights
set of int: departureSegments = 1..amountOfDepartureSegments;
set of int: returnSegments = 1..amountOfReturnSegments;
set of int: departureLegs = 1..highestAmountOfDepartureLegs;
set of int: returnLegs = 1..highestAmountOfReturnLegs;
set of int: departurePrices = 1..departurePricesOptions;
set of int: returnPrices = 1..returnPricesOptions;
set of int: hours = 0..23;
set of int: minutes = 0..59;
set of int: hoursN = -1..23;
set of int: minutesN = -1..59;
set of int: availables = 1..amountOfAvailableHours;
%%lodgings
set of int: lodgings = 1..amountOfLodgings;
set of int: lodgingFeatures = 1..maxAmountOfFeatures;
%%constantes
int: highestAmountOfDepartureLegs = max(departureSegmentsStops) + 1; %%el dato ingresa como departureSegmentsOptions
int: highestAmountOfReturnLegs = max(returnSegmentsStops) + 1;
int: amountOfAvailableHours = sum([timeWindowEndHours[i] - timeWindowStartHours[i] | i in 1..length(timeWindowStartHours)]) + length(timeWindowStartHours);
array [availables] of hours: availableTime = [j | i in 1..length(timeWindowEndHours), j in timeWindowStartHours[i]..timeWindowEndHours[i]];

%%Entradas
%%Requirements
int: amountOfDepartureSegments;
int: amountOfReturnSegments;
int: amountOfLodgings;
int: departurePricesOptions;
int: returnPricesOptions;
int: maxAmountOfDepartureSegments;
int: maxAmountOfReturnSegmentsOptions;
int: maxAmountOfFeatures;
int : maxPrice;
int : maxStops;
int : maxStopsDuration;
int : maxTotalDuration;
array [int] of 0..7: allowAerolines;
bool: allowIntermediaries;
array [int] of hours: timeWindowStartHours;
array [int] of minutes: timeWindowStartMinutes;
array [int] of hours: timeWindowEndHours;
array [int] of minutes: timeWindowEndMinutes;
%%Lodging
int : beedrooms;
int : beds;
int : bathrooms;
bool : isSuperHost;
array [int] of int: features;
array [int] of 0..4: allowPolicies;

%%
%%departure
array [departureSegments] of string: departureSegmentsId;
array [departureSegments] of int: departureSegmentsDuration;
array [departureSegments] of int: departureSegmentsStops;
array [departureSegments,departureLegs] of  int : departureLegsDepartures;
array [departureSegments,departureLegs] of  int : departureLegsArrivals;
array [departureSegments,departureLegs] of  int : departureLegsDuration;
array [departureSegments,departureLegs] of  hoursN : departureLegsDeparturesHours;
array [departureSegments,departureLegs] of  minutesN : departureLegsDeparturesMinutes;
array [departureSegments,departureLegs] of  hoursN : departureLegsArrivalsHours;
array [departureSegments,departureLegs] of  minutesN : departureLegsArrivalsMinutes;
array [departureSegments,departureLegs] of  -1..7 : departureLegsAeroline;
array [departureSegments,departurePrices] of  int : departureSegmentsPrices; 
array [departureSegments,departurePrices] of  int : departureSegmentsPricesAgents;
array [departureSegments,departurePrices] of  int : departureSegmentsPricesIsCarrier;
array [departureSegments,departurePrices] of  int : departureSegmentsAgentsScore;
%%return
array [returnSegments] of string: returnSegmentsId;
array [returnSegments] of int: returnSegmentsDuration;
array [returnSegments] of int: returnSegmentsStops;
array [returnSegments,returnLegs] of  int : returnLegsDepartures;
array [returnSegments,returnLegs] of  int : returnLegsArrivals;
array [returnSegments,returnLegs] of  int : returnLegsDuration;
array [returnSegments,returnLegs] of  hoursN : returnLegsDeparturesHours;
array [returnSegments,returnLegs] of  minutesN : returnLegsDeparturesMinutes;
array [returnSegments,returnLegs] of  hoursN : returnLegsArrivalsHours;
array [returnSegments,returnLegs] of  minutesN : returnLegsArrivalsMinutes;
array [returnSegments,returnLegs] of  -1..7 : returnLegsAeroline;
array [returnSegments,returnPrices] of  int : returnSegmentsPrices; 
array [returnSegments,returnPrices] of  int : returnSegmentsPricesAgents;
array [returnSegments,returnPrices] of  -1..1 : returnSegmentsPricesIsCarrier;
array [returnSegments,returnPrices] of  -1..500 : returnSegmentsAgentsScore;
%%lodging
array [lodgings] of string: lodgingsId;
array [lodgings] of int: lodgingsStartDate;
array [lodgings] of int: lodgingsEndDate;
array [lodgings] of int: lodgingsPeople;
array [lodgings] of int: lodgingsBathrooms;
array [lodgings] of int: lodgingsBedrooms;
array [lodgings] of int: lodgingsBeds;
array [lodgings] of bool: lodgingsIsSuperhost;
array [lodgings] of -1..500: lodgingsRating;
array [lodgings,lodgingFeatures] of int : lodgingsFeatures;
array [lodgings] of 0..4: lodgingsCancelPolicy;
array [lodgings] of int: lodgingsPriceTotalAmount;
%%variables
var departureSegments: posDeparture;
var returnSegments: posReturn;
var lodgings: posLodging;
var int: departureSegmentPrice;
var int: returnSegmentPrice;
var int: ahorro;
var int: lodgingPrice;
var -1..500: lodgingRat;
var -1..500: departureAgentScore;
var -1..500: returnAgentScore;
var -3..1500: totalScore;
var departurePrices: departurePricePos;
var returnPrices: returnPricePos;
var int: departureDate;
var departureLegs: departureDateLeg;

%%restricciones
%%duracion vuelos
constraint departureSegmentsDuration[posDeparture] <= maxTotalDuration;
constraint returnSegmentsDuration[posReturn] <= maxTotalDuration;

%%maxima cantidad de paradas-escalas
constraint departureSegmentsStops[posDeparture] <= maxStops;
constraint returnSegmentsStops[posReturn] <= maxStops;

%%duracion de paradas-escalas
constraint forall([departureLegsDuration[posDeparture,j] <= maxStopsDuration | j in departureLegs
                                                      where departureLegsDuration[posDeparture,j] != -1]);
                                                      
constraint forall([returnLegsDuration[posReturn,j] <= maxStopsDuration | j in returnLegs
                                                      where returnLegsDuration[posReturn,j] != -1]);
%%aerolineas permitidas                                                                                                          
constraint forall([member(allowAerolines, departureLegsAeroline[posDeparture,j]) 
| j in departureLegs where departureLegsAeroline[posDeparture,j] != -1]);

constraint forall([member(allowAerolines, returnLegsAeroline[posReturn,j]) 
| j in returnLegs where returnLegsAeroline[posReturn,j] != -1]);

%%ventanas de tiempo permitidas
%%departure departure
constraint forall([
                  member(availableTime, departureLegsDeparturesHours[posDeparture,j]) 
                  /\ verifyMinutes(departureLegsDeparturesHours[posDeparture,j], timeWindowStartHours, departureLegsDeparturesMinutes[posDeparture,j],timeWindowStartMinutes)
           | j in departureLegs where departureLegsDeparturesHours[posDeparture,j] != -1]);
%%departure arrival           
constraint forall([
                  member(availableTime, departureLegsArrivalsHours[posDeparture,j])
                  /\ verifyMinutes(departureLegsArrivalsHours[posDeparture,j], timeWindowEndHours, departureLegsArrivalsMinutes[posDeparture,j],timeWindowEndMinutes)      
           | j in departureLegs where departureLegsArrivalsHours[posDeparture,j] != -1]);         
%%return departure
constraint forall([
                  member(availableTime, returnLegsDeparturesHours[posReturn,j]) 
                  /\ verifyMinutes(returnLegsDeparturesHours[posReturn,j], timeWindowStartHours, returnLegsDeparturesMinutes[posReturn,j],timeWindowStartMinutes)
           | j in returnLegs where returnLegsDeparturesHours[posReturn,j] != -1]);
%%return arrival           
constraint forall([
                  member(availableTime, returnLegsArrivalsHours[posReturn,j])
                  /\ verifyMinutes(returnLegsArrivalsHours[posReturn,j], timeWindowEndHours, returnLegsArrivalsMinutes[posReturn,j],timeWindowEndMinutes)      
           | j in returnLegs where returnLegsArrivalsHours[posReturn,j] != -1]);
           
%%costos vuelos
 constraint departureSegmentPrice = departureSegmentsPrices[posDeparture,departurePricePos];
 constraint departureSegmentPrice != -1;
 constraint returnSegmentPrice = returnSegmentsPrices[posReturn,returnPricePos];
 constraint returnSegmentPrice != -1;
 constraint departureDate = departureLegsDepartures[posDeparture,departureDateLeg];
 constraint departureDate != -1;
 constraint departureAgentScore = departureSegmentsAgentsScore[posDeparture,departurePricePos];
 constraint returnAgentScore = returnSegmentsAgentsScore[posReturn,returnPricePos];
%%permite carriers
constraint if allowIntermediaries = false
            then departureSegmentsPricesIsCarrier[posDeparture,departurePricePos] = 1
            /\ returnSegmentsPricesIsCarrier[posReturn,returnPricePos] = 1
           endif;
%%LODGINGS
constraint lodgingsBathrooms[posLodging] >= bathrooms;
constraint lodgingsBedrooms[posLodging] >= beedrooms;
constraint lodgingsBeds[posLodging] >= beds;
constraint if isSuperHost = true
            then lodgingsIsSuperhost[posLodging] = true
           endif;
%%features
constraint forall([member(getRow(lodgingsFeatures,posLodging), features[i]) | i in 1..length(features)]);
%%cancel policies
constraint member(allowPolicies, lodgingsCancelPolicy[posLodging]);
constraint lodgingPrice = lodgingsPriceTotalAmount[posLodging];
constraint lodgingRat = lodgingsRating[posLodging];
%%total score puede ser maximo 1500 = 3 * 500
constraint totalScore = lodgingRat + departureAgentScore + returnAgentScore;
%%para que coincidan las fechas
%%para que coincidan las fechas
constraint forall([departureLegsDepartures[posDeparture,j] = lodgingsStartDate[posLodging]
          | j in departureLegs where departureLegsDepartures[posDeparture,j] != -1]);
          
constraint forall([returnLegsDepartures[posReturn,j] = lodgingsEndDate[posLodging]
          | j in returnLegs where returnLegsDepartures[posReturn,j] != -1]);
%%para optimizar
var int: totalPrice = departureSegmentPrice + returnSegmentPrice + lodgingPrice;
constraint totalPrice <= maxPrice;
constraint ahorro = maxPrice - totalPrice;

var float: ahorroScore = (ahorro * 1500 * 100) / maxPrice;
%%Funcion objetivo
solve maximize (15 * (totalScore * 100)) + (85 * ahorroScore);

%%predicados                      
predicate verifyMinutes(var int:hour, array [int] of int:allowHours, var int:minute, array [int] of int:allowMinutes) =
               forall([
                  if hour = allowHours[k]
                    then allowMinutes[k] >= minute
                  endif
               |k in 1..length(allowHours)]);

%%funciones               
function array [int] of  var int: getRow(array [int, int] of int: features, var int: row) = 
  [features[row,i] | i in lodgingFeatures];

%%Salida
output["{'Departure': { 'pos': ", show(posDeparture-1), ","];
output["'posAgent': ", show(departurePricePos-1), ","];
output["'id': ", show(departureSegmentsId[fix(posDeparture)]), "},"];
output["'Return': { 'pos': ", show(posReturn-1), ","];
output["'posAgent': ", show(returnPricePos-1), ","];
output["'id': ", show(returnSegmentsId[fix(posReturn)]), "},"];
output["'Lodging' : {'pos':", show(posLodging-1), ","];
output["'id' : ", show(lodgingsId[fix(posLodging)]), ","];
output["'checkInDays' : ", show(lodgingsStartDate[posLodging]), ","];
output["'checkOutDays' : ", show(lodgingsEndDate[posLodging]), "} }"];
%%output[show(totalPrice)];


