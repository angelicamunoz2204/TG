import { ExternalAPIsConstants } from '../../constants/externalAPIs/externalAPIsConstants';
import { Aeroline } from '../../models/Flights/aeroline.model';
import { Agent } from '../../models/Flights/agent.model';
import { Flight } from '../../models/Flights/flight.model';
import { Path } from '../../models/Flights/path.model';
import { FlightPrice } from '../../models/Flights/price.flights.model';
import { Score } from '../../models/Flights/score.model';
import { InputDataHelper } from './inputDataHelper';

export class FlightsDataHelper {
    inputDataHelper = new InputDataHelper()
    maxAmountOfDepartureSegments = 0;
    maxAmountOfReturnSegments = 0;
    amountOfDepartureFlights = 0;
    amountOfReturnFlights = 0;
    largestAmountOfDeparturePrices = 0;
    largestAmountOfReturnPrices = 0;

    createFlightsPaths(departureSegments:any[], returnSegments: any[]) {
    
        const departurePaths = this.createPathsArrays(
            this.createPaths(departureSegments, true),
            true
        );
        const returnPaths = this.createPathsArrays(
            this.createPaths(returnSegments, false),
            false
        );
        this.amountOfDepartureFlights = departurePaths[0].length;
        this.amountOfReturnFlights = returnPaths[0].length;
        return departurePaths.concat(returnPaths);
    }

    createPathsArrays(paths: any[], departure: boolean) {
        let flightsId: any[] = [];
        let flightsDuration: any[] = [];
        let flightsStops: any[] = [];
        let flightsDeparturesH: any[] = [];
        let flightsArrivalsH: any[] = [];
        let flightsDeparturesM: any[] = [];
        let flightsArrivalsM: any[] = [];
        let flightsStopsDepartures: any[] = [];
        let flightsStopsArrivals: any[] = [];
        let flightsStopsDuration: any[] = [];
        let flightsStopsAeroline: any[] = [];
        let flightsPriceOptions: any[] = [];
        let flightsPriceAgents: any[] = [];
        let flightsPriceCarrier: any[] = [];
        let flightsAgentsScore: any[] = [];
        for (let i = 0; i < paths.length; i++) {
            flightsId.push(paths[i].id);
            flightsDuration.push(paths[i].duration);
            flightsStops.push(paths[i].stops);
            let departures: any[] = [];
            let arrivals: any[] = [];
            let departuresHours: any[] = [];
            let departuresMinutes: any[] = [];
            let arrivalsHours: any[] = [];
            let arrivalsMinutes: any[] = [];
            let stopsDuration: any[] = [];
            let stopsAerolines: any[] = [];
    
            let maxAmountOfSegments = this.maxAmountOfDepartureSegments;
            let largestAmountOfPrices = this.largestAmountOfDeparturePrices;
            if (!departure) {
                maxAmountOfSegments = this.maxAmountOfReturnSegments;
                largestAmountOfPrices = this.largestAmountOfReturnPrices;
            }
    
            for (let j = 0; j < maxAmountOfSegments; j++) {
                if (j < paths[i].segments.length) {
                    departures.push(this.inputDataHelper.createDateDays(paths[i].segments[j].departureDate));
                    arrivals.push(this.inputDataHelper.createDateDays(paths[i].segments[j].arrivalDate));
                    departuresHours.push(
                        this.createDateTimes(paths[i].segments[j].departureDate)[0]
                    );
                    departuresMinutes.push(
                        this.createDateTimes(paths[i].segments[j].departureDate)[1]
                    );
                    arrivalsHours.push(this.createDateTimes(paths[i].segments[j].arrivalDate)[0]);
                    arrivalsMinutes.push(this.createDateTimes(paths[i].segments[j].arrivalDate)[1]);
                    stopsDuration.push(paths[i].segments[j].duration);
                    stopsAerolines.push(paths[i].segments[j].aeroline.id);
                } else {
                    departures.push(-1);
                    arrivals.push(-1);
                    departuresHours.push(-1);
                    departuresMinutes.push(-1);
                    arrivalsHours.push(-1);
                    arrivalsMinutes.push(-1);
                    stopsDuration.push(-1);
                    stopsAerolines.push(-1);
                }
            }
            flightsStopsDepartures[i] = departures;
            flightsStopsArrivals[i] = arrivals;
            flightsDeparturesH[i] = departuresHours;
            flightsDeparturesM[i] = departuresMinutes;
            flightsArrivalsH[i] = arrivalsHours;
            flightsArrivalsM[i] = arrivalsMinutes;
            flightsStopsDuration[i] = stopsDuration;
            flightsStopsAeroline[i] = stopsAerolines;
    
            let prices: any[] = [];
            let agents: any[] = [];
            let isCarrier: any[] = [];
            let agentsScores: any[] = [];
    
            for (let j = 0; j < largestAmountOfPrices; j++) {
                if (j < paths[i].price.length) {
                    agents.push(paths[i].price[j].agent.id);
                    isCarrier.push(paths[i].price[j].agent.isCarrier ? 1 : 0);
                    agentsScores.push(paths[i].price[j].agent.score.rating);
                    if (paths[i].price[j].amount) {
                        prices.push(paths[i].price[j].amount);
                    } else {
                        prices.push(0);
                    }
                } else {
                    agents.push(-1);
                    isCarrier.push(-1);
                    prices.push(-1);
                    agentsScores.push(-1);
                }
            }
            flightsPriceOptions[i] = prices;
            flightsPriceAgents[i] = agents;
            flightsPriceCarrier[i] = isCarrier;
            flightsAgentsScore[i] = agentsScores;
        }
        return [
            flightsId,
            flightsDuration,
            flightsStops,
            flightsDeparturesH,
            flightsDeparturesM,
            flightsArrivalsH,
            flightsArrivalsM,
            flightsStopsDepartures,
            flightsStopsArrivals,
            flightsStopsDuration,
            flightsStopsAeroline,
            flightsPriceOptions,
            flightsPriceAgents,
            flightsPriceCarrier,
            flightsAgentsScore,
        ];
    }

    createPaths(paths: any[], departure: boolean) {
        let segments: Path[] = [];
        for (let i = 0; i < paths.length; i++) {
            const path: Path = {
                id: `"${paths[i].id}"`,
                stops: paths[i].legs[0].stopCount,
                duration: paths[i].legs[0].durationInMinutes,
                departureDate: paths[i].legs[0].departure,
                arrivalDate: paths[i].legs[0].arrival,
                segments: this.createFlights(paths[i].legs[0].segments),
                price: this.createPrices(paths[i].pricing_options),
            };
            //pulir codigo
            if (departure) {
                if (paths[i].legs[0].segments.length > this.maxAmountOfDepartureSegments) {
                    this.maxAmountOfDepartureSegments = paths[i].legs[0].segments.length;
                }
                if (paths[i].pricing_options.length > this.largestAmountOfDeparturePrices) {
                    this.largestAmountOfDeparturePrices = paths[i].pricing_options.length;
                }
            } else {
                if (paths[i].legs[0].segments.length > this.maxAmountOfReturnSegments) {
                    this.maxAmountOfReturnSegments = paths[i].legs[0].segments.length;
                }
                if (paths[i].pricing_options.length > this.largestAmountOfReturnPrices) {
                    this.largestAmountOfReturnPrices = paths[i].pricing_options.length;
                }
            }
            segments.push(path);
        }
        return segments;
    }
    
    createFlights(segments: any[]): Flight[] {
        let flights: Flight[] = [];
        for (let i = 0; i < segments.length; i++) {
            const aer = ExternalAPIsConstants.aerolines;
            let aerolinea: Aeroline | undefined = aer.find(
                (aerolinea: Aeroline) =>
                    aerolinea.name === segments[i].marketingCarrier.name
            );
            let aerolineId = 0;
            if (aerolinea) {
                aerolineId = aerolinea.id;
            }
            const aeroline: Aeroline = {
                id: aerolineId,
                name: segments[i].marketingCarrier.name,
            };
            const segment: Flight = {
                id: segments[i].id,
                duration: segments[i].durationInMinutes,
                departureDate: segments[i].departure,
                arrivalDate: segments[i].arrival,
                aeroline: aeroline,
            };
            flights.push(segment);
        }
        return flights;
    }
    
    createPrices(priceOptions: any[]): FlightPrice[] {
        let prices: FlightPrice[] = [];
    
        for (let i = 0; i < priceOptions.length; i++) {
            const available = priceOptions[i].agents[0].rating_status === 'available';
            let score: Score;
            if (available) {
                //quitar modelo de score
                score = {
                    ratingAvailable: available,
                    rating: Math.round(priceOptions[i].agents[0].rating * 100)
                };
            } else {
                score = {
                    ratingAvailable: available,
                    rating: -1
                };
            }
            const agents = ExternalAPIsConstants.agents;
            let agentes: any | undefined = agents.find(
                (agent) => agent.name === priceOptions[i].agents[0].name
            );
            let agentsId = 0;
            if (agentes) {
                agentsId = agentes.id;
            }
            const agent: Agent = {
                id: agentsId,
                name: priceOptions[i].agents[0].name,
                isCarrier: priceOptions[i].agents[0].is_carrier,
                score: score,
            };
            const price: FlightPrice = {
                agent: agent,
                amount: Math.round(priceOptions[i].price.amount * 100),
            };
            prices.push(price);
        }
        return prices;
    }

    createDateTimes(date: string) {
        let dates: number[] = [];
        const dateNumber = new Date(date);
        dates.push(dateNumber.getHours());
        dates.push(dateNumber.getMinutes());
    
        return dates;
    }

}