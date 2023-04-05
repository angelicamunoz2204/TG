import { Request, Response } from 'express';
import CLIMiniZinc from 'minizinc/build/CLIMiniZinc';
const axios = require("axios");
import { IModelParams } from 'minizinc/src/interfaces';
import { Constants } from '../constants';
import { Aeroline } from '../models/Flights/aeroline.model';
import { Agent } from '../models/Flights/agent.model';
import { Flight } from '../models/Flights/flight.model';
import { Input } from '../models/input.model';
import { Path } from '../models/Flights/path.model';
import { FlightPrice } from '../models/Flights/price.flights.model';
import { Score } from '../models/Flights/score.model';
import { Lodging } from '../models/Lodgings/lodging.model';
import { Policy } from '../models/Lodgings/policy.model';
import { LodgingPrice } from '../models/Lodgings/price.lodging.model';
const fs = require("fs");
const minizincModel = fs.readFileSync("./minizincModel/travelManagementMinizinc.mzn", 'utf-8')
//const modelInputData = fs.readFileSync("./minizincModel/travelRequerimentsData.dzn", 'utf-8')

const minizincDataRequirements = Constants.minizincDataRequirements
const minizincDataRequirementsLong = Constants.minizincDataRequirementsLong
const minizincDataRequirementsDim = Constants.minizincDataRequirementsDim
const minizincDataFlights = Constants.minizincDataFlights
const minizincDataFlightsLong = Constants.minizincDataFlightsLong
const minizincDataFlightsDim = Constants.minizincDataFlightsDim
const minizincDataLodgings = Constants.minizincDataLodgings
const minizincDataLodgingsDim = Constants.minizincDataLodgingsDim
const minizincDataLodgingsLong = Constants.minizincDataLodgingsLong

let maxAmountOfDepartureSegments = 0
let maxAmountOfReturnSegments = 0
let amountOfDepartureFlights = 0
let amountOfReturnFlights = 0
let largestAmountOfDeparturePrices = 0
let largestAmountOfReturnPrices = 0
let amountOfLodgings = 0
let largestAmountOfFeatures = 0

const inputData: Input = {
    origin: 'CLO',
    destination: 'MDE',
    startDate: new Date(2023, 3, 1),
    endDate: new Date(2023, 3, 5),
    startTime: [new Date(2023, 3, 1, 0, 0)],
    duration: 3,
    endTime: [new Date(2023, 3, 5, 23, 59)],
    adults: 1,
    children: 0,
    cabinClass: 1,
    maxPrice: 2200,
    maxStops: 2,
    maxStopsDuration: 300,
    maxTotalDuration: 700,
    allowAerolines: [1, 2, 3, 4],
    allowIntermediaries: true,
    minScoreFlights: 40,
    minScoreLodging: 45,
    beedrooms: 1,
    beds: 1,
    bathrooms: 1,
    isSuperHost: false,
    features: [1, 2, 5]
}

async function getFlightsData(origin: string, destination: string, departureDate: string) {
    //const url = 'https://catfact.ninja/facts';
    const url = 'https://skyscanner44.p.rapidapi.com/search-extended';
    // Display list of all flights.
    var flights: any[] = []
    const options = {
        method: 'GET',
        url: url,
        params: {
            adults: '1',
            origin: origin,
            destination: destination,
            departureDate: departureDate,
            //'2023-01-23'
            currency: 'USD',
            stops: '0,1,2',
            /*duration: '50',
            startFrom: '00:00',
            arriveTo: '23:59',
            returnStartFrom: '00:00',
            returnArriveTo: '23:59'*/
        },
        headers: {
            //JP
            //'X-RapidAPI-Key':'62c27ba1abmshdabf3077b3f72b1p1adddajsn9262e48ecdc2',
            //Yo
            'X-RapidAPI-Key': '603e891f9emshb24af355cf30aadp13595fjsn84c2e8bb5704',
            'X-RapidAPI-Host': 'skyscanner44.p.rapidapi.com',
            useQueryString: true
        }
    };

    var result = await getAllflights(options);
    //console.log(result)
    flights = result.itineraries.results
    return flights;
}

async function getHotelsData(checkin:string, checkout:string) {
    const url = 'https://airbnb13.p.rapidapi.com/search-location'

    const options = {
        method: 'GET',
        url: url,
        params: {
          location: 'Medellin',
          checkin: checkin,
          checkout: checkout,
          adults: '1',
          children: '0',
          infants: '0',
          page: '1'
        },
        headers: {
           //JP
          //'X-RapidAPI-Key':'62c27ba1abmshdabf3077b3f72b1p1adddajsn9262e48ecdc2',
          //Yo
          'X-RapidAPI-Key': '603e891f9emshb24af355cf30aadp13595fjsn84c2e8bb5704',
          'X-RapidAPI-Host': 'airbnb13.p.rapidapi.com'
        }
      };

      var result = await getAllflights(options);
      //console.log("r",result)
      return result.results
}

function translateAvailableTime(requirements: Input) {
    let startTimesHours = []
    let startTimesMinutes = []
    let endTimesHours = []
    let endTimesMinutes = []

    for (let i = 0; i < requirements.startTime.length; i++) {
        startTimesHours.push(requirements.startTime[i].getHours())
        startTimesMinutes.push(requirements.startTime[i].getMinutes())
        endTimesHours.push(requirements.endTime[i].getHours())
        endTimesMinutes.push(requirements.endTime[i].getMinutes())
    }

    return([startTimesHours,
        startTimesMinutes,
        endTimesHours,
        endTimesMinutes
    ])
}

function createRequiredInformation(requirements: Input) {
    const availableTime = translateAvailableTime(requirements)
    const body = [amountOfDepartureFlights, amountOfReturnFlights, amountOfLodgings, largestAmountOfDeparturePrices, 
        largestAmountOfReturnPrices, maxAmountOfDepartureSegments, maxAmountOfReturnSegments, largestAmountOfFeatures,
        requirements.maxPrice, requirements.maxStops, requirements.maxStopsDuration,
        requirements.maxTotalDuration, requirements.allowAerolines, requirements.allowIntermediaries,
        availableTime[0], availableTime[1], availableTime[2], availableTime[3], requirements.minScoreFlights,
        requirements.minScoreLodging, requirements.beedrooms, requirements.beds, requirements.bathrooms,
        requirements.isSuperHost, requirements.features]

    return body
}

async function createFlightsPaths(req: Input) {
    let requirements = structuredClone(req)
    const start = requirements.startDate
    const end = requirements.endDate
    const duration = requirements.duration
    const durationMils = duration*1440*60000

    let departureSegments: any[] = []
    let returnSegments: any[] = []
    while ((end.getTime() - durationMils) >= start.getTime()) {
        const rt = new Date(start)
        const h = new Date(rt.setDate(rt.getDate() + duration))
        var startString = start.toISOString().slice(0,10)
        var endString = h.toISOString().slice(0,10)
        const dep: any[] = await getFlightsData(requirements.origin, requirements.destination, startString)
        departureSegments = departureSegments.concat(dep)
        const ret: any[] = await getFlightsData(requirements.destination, requirements.origin, endString)
        returnSegments = returnSegments.concat(ret)
        start.setDate(start.getDate()+1)
    }

    const departurePaths = createPathsArrays(createPaths(departureSegments,true),true);
    const returnPaths = createPathsArrays(createPaths(returnSegments,false),false);
    amountOfDepartureFlights = departurePaths[0].length
    amountOfReturnFlights = returnPaths[0].length
    return departurePaths.concat(returnPaths)
}

async function createLodgingsPaths(req: Input) {
    let requirements = structuredClone(req)
    const start = requirements.startDate
    const end = requirements.endDate
    const duration = requirements.duration
    const durationMils = duration*1440*60000
    let lodgings: any[] = []

    while ((end.getTime() - durationMils) >= start.getTime()) {
        const rt = new Date(start)
        const h = new Date(rt.setDate(rt.getDate() + duration))
        var startString = start.toISOString().slice(0,10)
        var endString = h.toISOString().slice(0,10)

        const lodgs: any[] = await getHotelsData(startString,endString)
        lodgings = lodgings.concat(lodgs)

        start.setDate(start.getDate()+1)
      }
    
    const lodgingsPaths = createLodgingsArrays(createLodgings(lodgings));
    amountOfLodgings = lodgingsPaths[0].length
    return lodgingsPaths
}

export async function sendflightsInformation(req: Request, res: Response) {
    var requirements = inputData
    const flightsPaths = await createFlightsPaths(requirements)
    const requiredInf = createRequiredInformation(requirements)
    const paths = requiredInf.concat(flightsPaths)
    const minizincDataName = minizincDataRequirements.concat(minizincDataFlights)
    const minizincDataLong = minizincDataRequirementsLong.concat(minizincDataFlightsLong)
    const minizincDataDim = minizincDataRequirementsDim.concat(minizincDataFlightsDim)
    createDznFile(paths,minizincDataName,minizincDataLong,minizincDataDim)
    res.send("Ok flights")
}

export async function sendLodgingsInformation(req: Request, res: Response) {
    var requirements = inputData
    const lodgingsPaths = await createLodgingsPaths(requirements)
    const requiredInf = createRequiredInformation(requirements)
    const paths = requiredInf.concat(lodgingsPaths)
    const minizincDataName = minizincDataRequirements.concat(minizincDataLodgings)
    const minizincDataLong = minizincDataRequirementsLong.concat(minizincDataLodgingsLong)
    const minizincDataDim = minizincDataRequirementsDim.concat(minizincDataLodgingsDim)
    createDznFile(paths,minizincDataName,minizincDataLong,minizincDataDim)
    res.send("Ok lodgings")
}

export async function sendAllInformation(req: Request, res: Response) {
    var requirements = inputData
    const flightsPaths = await createFlightsPaths(requirements)
    const lodgingsPaths = await createLodgingsPaths(requirements)
    const requiredInf = createRequiredInformation(requirements)
    const paths = requiredInf.concat(flightsPaths,lodgingsPaths)
    const minizincDataName = minizincDataRequirements.concat(minizincDataFlights,minizincDataLodgings)
    const minizincDataLong = minizincDataRequirementsLong.concat(minizincDataFlightsLong,minizincDataLodgingsLong)
    const minizincDataDim = minizincDataRequirementsDim.concat(minizincDataFlightsDim,minizincDataLodgingsDim)
    createDznFile(paths,minizincDataName,minizincDataLong,minizincDataDim)
    res.send("Ok all")
}

function createLodgings(lodgings: any[]) {
    let lod: Lodging[] = []
    for (let i = 0; i < lodgings.length; i++) {
        const url = lodgings[i].url
        const urlLarg = url.length
        const deeplink = lodgings[i].deeplink 
        const deepLarg = deeplink.length
        const start = deeplink.slice(urlLarg+10,urlLarg+20)
        const end = deeplink.slice(urlLarg+31,urlLarg+41)
        const lodging: Lodging = {
            id : `"${lodgings[i].id}"`,
            startDate: createDateDays(start),
            endDate: createDateDays(end),
            people: lodgings[i].persons,
            bathrooms: Math.floor(lodgings[i].bathrooms),
            bedrooms: lodgings[i].bedrooms,
            beds: lodgings[i].beds,
            isSuperhost: lodgings[i].isSuperhost,
            rating: lodgings[i].rating? Math.round(lodgings[i].rating*100) : -1,
            features: lodgings[i].amenityIds,
            cancelPolicies: createPolicies(lodgings[i].cancelPolicy),
            price: lodgings[i].price.total
        }
        if (lodgings[i].amenityIds.length > largestAmountOfFeatures) {
            largestAmountOfFeatures = lodgings[i].amenityIds.length
        }
        lod.push(lodging)
    }
    return lod
}

function createPolicies(cancelPolicy: string) {
    const cancelPolicies = Constants.cancelPolicies
    let policy: Policy | undefined = cancelPolicies.find((pol: Policy) => pol.name === cancelPolicy)
    if (!policy) {
        return 1
    }
    return policy.id
}

function createDateDays(dat: string) {
    const firstDate = new Date("2023-01-01")
    const secondDate = new Date(dat)
    const sDateMinutes = secondDate.setUTCHours(0,0,0,0) / 60000
    const fDateMinutes = firstDate.setUTCHours(0,0,0,0) / 60000
    const days = (sDateMinutes-fDateMinutes)/1440
  
    return days
  }

function createLodgingPrices(price: any) {
    const lodgingPrice: LodgingPrice = {
        totalAmount: price.total,
        rate: price.rate,
        lodgingAmount: price.priceItems[0].amount,
        cleaningFee: price.priceItems[1]? price.priceItems[1].amount : -1,
        serviceFee: price.priceItems[2]? price.priceItems[2].amount : -1
    }
    return lodgingPrice
}

function createLodgingsArrays(lodgings: any[]) {
    let lodgingsId = []
    let lodgingsStartDate = []
    let lodgingsEndDate = []
    let lodgingsPeople = []
    let lodgingsBathrooms = []
    let lodgingsBedrooms = []
    let lodgingsBeds = []
    let lodgingsIsSuperhost = []
    let lodgingsRating = []
    let lodgingsFeatures = []
    let lodgingsCancelPolicy = []
    let lodgingsPriceTotalAmount = []

    for (let i = 0; i < lodgings.length; i++) {
        lodgingsId.push(lodgings[i].id)
        lodgingsStartDate.push(lodgings[i].startDate)
        lodgingsEndDate.push(lodgings[i].endDate)
        lodgingsPeople.push(lodgings[i].people)
        lodgingsBathrooms.push(lodgings[i].bathrooms)
        lodgingsBedrooms.push(lodgings[i].bedrooms)
        lodgingsBeds.push(lodgings[i].beds)
        lodgingsIsSuperhost.push(lodgings[i].isSuperhost)
        lodgingsRating.push(lodgings[i].rating)
        if (largestAmountOfFeatures > lodgings[i].features.length) {
            const featuresLength = lodgings[i].features.length
            for (let j = 0; j < (largestAmountOfFeatures-featuresLength); j++) {
                lodgings[i].features.push(-1)
            }
        }
        lodgingsFeatures.push(lodgings[i].features)
        lodgingsCancelPolicy.push(lodgings[i].cancelPolicies)
        lodgingsPriceTotalAmount.push(lodgings[i].price * 100)
    }
    return ([lodgingsId,
    lodgingsStartDate,
    lodgingsEndDate,
    lodgingsPeople,
    lodgingsBathrooms,
    lodgingsBedrooms,
    lodgingsBeds,
    lodgingsIsSuperhost,
    lodgingsRating,
    lodgingsFeatures,
    lodgingsCancelPolicy,
    lodgingsPriceTotalAmount])
}

function createPaths(paths: any[], departure: boolean) {
    let segments: Path[] = []
    for (let i = 0; i < paths.length; i++) {
        const path: Path = {
            id: `"${paths[i].id}"`,
            stops: paths[i].legs[0].stopCount,
            duration: paths[i].legs[0].durationInMinutes,
            departureDate: paths[i].legs[0].departure,
            arrivalDate: paths[i].legs[0].arrival,
            segments: createFlights(paths[i].legs[0].segments),
            price: createPrices(paths[i].pricing_options)
        }
        //pulir codigo
        if (departure) {
            if (paths[i].legs[0].segments.length > maxAmountOfDepartureSegments) {
                maxAmountOfDepartureSegments = paths[i].legs[0].segments.length
            }
            if (paths[i].pricing_options.length > largestAmountOfDeparturePrices) {
                largestAmountOfDeparturePrices = paths[i].pricing_options.length
            }
        } else {
            if (paths[i].legs[0].segments.length > maxAmountOfReturnSegments) {
                maxAmountOfReturnSegments = paths[i].legs[0].segments.length
            }
            if (paths[i].pricing_options.length > largestAmountOfReturnPrices) {
                largestAmountOfReturnPrices = paths[i].pricing_options.length
            }
        }
        segments.push(path)
    }
    return segments;
}

function createFlights(segments: any[]): Flight[] {
    let flights: Flight[] = []
    for (let i = 0; i < segments.length; i++) {
        const aer = Constants.aerolines
        let aerolinea: Aeroline | undefined = aer.find((aerolinea: Aeroline) => aerolinea.name === segments[i].marketingCarrier.name)
        let aerolineId = 0
        if (aerolinea) {
            aerolineId = aerolinea.id
        }
        const aeroline: Aeroline = {
            id: aerolineId,
            name: segments[i].marketingCarrier.name
        }
        const segment: Flight = {
            id: segments[i].id,
            duration: segments[i].durationInMinutes,
            departureDate: segments[i].departure,
            arrivalDate: segments[i].arrival,
            aeroline: aeroline
        }
        flights.push(segment)
    }
    return flights;
}

function createPrices(priceOptions: any[]): FlightPrice[] {
    let prices: FlightPrice[] = []

    for (let i = 0; i < priceOptions.length; i++) {
        const available = priceOptions[i].agents[0].rating_status === "available"
        let score: Score
        if (available) {
            //quitar modelo de score
            score = {
                ratingAvailable: available,
                rating: Math.round(priceOptions[i].agents[0].rating * 100),
                /*feedbackCount: priceOptions[i].agents[0].feedback_count,
                reliablePrices: priceOptions[i].agents[0].rating_breakdown.reliable_prices,
                clearExtraFees: priceOptions[i].agents[0].rating_breakdown.clear_extra_fees,
                customerService: priceOptions[i].agents[0].rating_breakdown.customer_service,
                easeOfBooking: priceOptions[i].agents[0].rating_breakdown.ease_of_booking,
                other: priceOptions[i].agents[0].rating_breakdown.other*/
            }
        }
        else {
            score = {
                ratingAvailable: available,
                rating: -1,
                /*feedbackCount: 0,
                reliablePrices: 0,
                clearExtraFees: 0,
                customerService: 0,
                easeOfBooking: 0,
                other: 0*/
            }
        }
        const agents = Constants.agents
        let agentes: any | undefined = agents.find((agent) => agent.name === priceOptions[i].agents[0].name)
        let agentsId = 0
        if (agentes) {
            agentsId = agentes.id
        }
        const agent: Agent = {
            id: agentsId,
            name: priceOptions[i].agents[0].name,
            isCarrier: priceOptions[i].agents[0].is_carrier,
            score: score
        }
        const price: FlightPrice = {
            agent: agent,
            amount: Math.round(priceOptions[i].price.amount * 100)
        }
        prices.push(price)
    }
    return prices
}


function createDates(date: string) {
    let dates = []
    const dateNumber = new Date(date)
    dates.push(dateNumber.getFullYear())
    dates.push(dateNumber.getMonth() + 1)
    dates.push(dateNumber.getDate())
    dates.push(dateNumber.getHours())
    dates.push(dateNumber.getMinutes())

    return dates;
}

function createPathsArrays(paths: any[], departure: boolean) {
    let flightsId = []
    let flightsDuration = []
    let flightsStops = []
    let flightsDeparturesH = []
    let flightsArrivalsH = []
    let flightsDeparturesM = []
    let flightsArrivalsM = []
    let flightsStopsDepartures = []
    let flightsStopsArrivals = []
    let flightsStopsDuration = []
    let flightsStopsAeroline = []
    let flightsPriceOptions = []
    let flightsPriceAgents = []
    let flightsPriceCarrier = []
    let flightsAgentsScore = []
    for (let i = 0; i < paths.length; i++) {
        flightsId.push(paths[i].id)
        flightsDuration.push(paths[i].duration)
        flightsStops.push(paths[i].stops)
        let departures = []
        let arrivals = []
        let departuresHours = []
        let departuresMinutes = []
        let arrivalsHours = []
        let arrivalsMinutes = []
        let stopsDuration = []
        let stopsAerolines = []

        let maxAmountOfSegments = maxAmountOfDepartureSegments
        let largestAmountOfPrices = largestAmountOfDeparturePrices
        if(!departure) {
            maxAmountOfSegments = maxAmountOfReturnSegments
            largestAmountOfPrices = largestAmountOfReturnPrices
        }

        for (let j = 0; j < maxAmountOfSegments; j++) {
            if (j < paths[i].segments.length) {
                departures.push(createDateDays(paths[i].segments[j].departureDate))
                arrivals.push(createDateDays(paths[i].segments[j].arrivalDate))
                departuresHours.push(createDates(paths[i].segments[j].departureDate)[3])//arreglar esto sin usar createDates
                departuresMinutes.push(createDates(paths[i].segments[j].departureDate)[4])
                arrivalsHours.push(createDates(paths[i].segments[j].arrivalDate)[3])
                arrivalsMinutes.push(createDates(paths[i].segments[j].arrivalDate)[4])
                stopsDuration.push(paths[i].segments[j].duration)
                stopsAerolines.push(paths[i].segments[j].aeroline.id)
            } else {
                departures.push(-1)
                arrivals.push(-1)
                departuresHours.push(-1)
                departuresMinutes.push(-1)
                arrivalsHours.push(-1)
                arrivalsMinutes.push(-1)
                stopsDuration.push(-1)
                stopsAerolines.push(-1)
            }
        }
        flightsStopsDepartures[i] = departures
        flightsStopsArrivals[i] = arrivals
        flightsDeparturesH[i] = departuresHours
        flightsDeparturesM[i] = departuresMinutes
        flightsArrivalsH[i] = arrivalsHours
        flightsArrivalsM[i] = arrivalsMinutes
        flightsStopsDuration[i] = stopsDuration
        flightsStopsAeroline[i] = stopsAerolines

        let prices = []
        let agents = []
        let isCarrier = []
        let agentsScores = []

        for (let j = 0; j < largestAmountOfPrices; j++) {
            if (j < paths[i].price.length) {
                agents.push(paths[i].price[j].agent.id)
                isCarrier.push(paths[i].price[j].agent.isCarrier ? 1 : 0)
                /*let scores = []
                scores.push(paths[i].price[j].agent.score.rating)
                scores.push(paths[i].price[j].agent.score.feedbackCount)
                scores.push(paths[i].price[j].agent.score.reliablePrices)
                scores.push(paths[i].price[j].agent.score.clearExtraFees)
                scores.push(paths[i].price[j].agent.score.customerService)
                scores.push(paths[i].price[j].agent.score.easeOfBooking)
                scores.push(paths[i].price[j].agent.score.other)
                agentsScores.push(scores)*/
                agentsScores.push(paths[i].price[j].agent.score.rating)
                if (paths[i].price[j].amount) {
                    prices.push(paths[i].price[j].amount)
                }
                else {
                    prices.push(0)
                }
            } else {
                agents.push(-1)
                isCarrier.push(-1)
                prices.push(-1)
                agentsScores.push(-1)
            }
        }
        flightsPriceOptions[i] = prices
        flightsPriceAgents[i] = agents
        flightsPriceCarrier[i] = isCarrier
        flightsAgentsScore[i] = agentsScores
    }
    //createDznFile
    return ([flightsId,
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
        flightsAgentsScore])
}

function createDznFile(paths: any[], minizincDataName: string[], minizincDataLong: number[], minizincDataDim: number[]) {
    var fileContent: string = ""

    for (let i = 0; i < minizincDataName.length; i++) {
        if (minizincDataLong[i] == 0) {
            fileContent += `${minizincDataName[i]} = ${paths[i]};\n`
        } else {
            fileContent += `${minizincDataName[i]} = ${createDznText(paths[i], minizincDataLong[i], minizincDataDim[i])}`
        }
    }

    var filepath = "./minizincModel/mynewfile.dzn";

    fs.writeFileSync(filepath, fileContent, (err: any) => {
        if (err) throw err;
        console.log("The file was succesfully saved!");
    });

    return filepath;
}

function createDznText(data: any[], long: number, dim: number) {
    //arreglar esta funcion para que solo haga de dos dimensiones, porque de 3 ya no existen
    //y de 1 simplemente hay que concatenar un "[" al inicio y un "]" al final
    let dataText = "["
    if (dim > 1) {
        dataText = dataText.concat("|")
    }
    for (let i = 1; i <= data.length; i++) {
        if (dim > 1) {
            for (let j = 0; j < data[i - 1].length; j++) {
                if (dim === 3) {
                    if (j === 0) {
                        dataText = dataText.concat("|")
                    }
                    for (let k = 0; k < data[i - 1][j].length; k++) {
                        if (k < data[i - 1][j].length - 1) {
                            dataText = dataText.concat(data[i - 1][j][k].toString(), ",")
                        }
                        else {
                            dataText = dataText.concat(data[i - 1][j][k].toString(), "|")
                            if (j === data[i - 1].length - 1 && i < data.length) {
                                dataText = dataText.concat(",")
                            }
                        }
                    }
                }
                if (dim === 2) {
                    if (j < data[i - 1].length - 1) {
                        dataText = dataText.concat(data[i - 1][j].toString(), ",")
                    }
                    else {
                        dataText = dataText.concat(data[i - 1][j].toString(), "|")
                    }
                }
            }
        }
        else {
            if (i < data.length) {
                dataText = dataText.concat(data[i - 1].toString(), ",")
            }
            else {
                dataText = dataText.concat(data[i - 1].toString())
            }
        }
        if (i % long === 0 || i === data.length) {
            if (i === data.length) {
                if (dim > 2) {
                    dataText = dataText.concat("|", "];")
                }
                else {
                    dataText = dataText.concat("];")
                }
            }
            dataText = dataText.concat("\n")
        }
    }
    return dataText;
}

function getAllflights(query: Object): Promise<any> {
    const promise = axios.request(query)
    const dataPromise = promise.then((response: any) => response.data)
        .catch((error: Error) => error);
    return dataPromise;
}


const myModel: IModelParams = {
    model: String(minizincModel),
    solver: "gecode",
    all_solutions: true
};

/* const m = new CLIMiniZinc();
m.solve(myModel, modelInputData).then((result) => {
  console.log(result);
}); */