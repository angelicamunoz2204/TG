import axios from 'axios';
import { ExternalAPIsConnectionConstants } from '../constants/externalAPIs/externalAPIsConnectionConstants';
import { Input } from '../models/Input/input.model';
import { ExternalFlightsAPIParametersModel } from '../models/Params/externalFlightsAPIParameters.model';
import { setTimeout } from "timers/promises";

export class ExternalFlightsAPIService {

    async getFlightsFromExternalAPI(params: ExternalFlightsAPIParametersModel) {
        const options = {
            method: 'GET',
            url: ExternalAPIsConnectionConstants.flightsExternalAPI.url,
            params: params,
            headers: ExternalAPIsConnectionConstants.flightsExternalAPI.headers
        };
    
        var result = await this.getExternalApiInformation(options);
        console.log(result)
        //result.itineraries.results
        return result;
    }

    async getFlightsBetweenDates(req: Input) {
        let requirements = structuredClone(req);
        const start = requirements.startDate;
        const end = requirements.endDate;
        const duration = requirements.duration;
        const durationMils = duration * 1440 * 60000;

        const infants = requirements.infants;
        const children = requirements.children;

        let departureParams: ExternalFlightsAPIParametersModel = {
            adults: requirements.adults,
            origin: requirements.origin.IATA,
            destination: requirements.destination.IATA,
            departureDate: requirements.startDate.toISOString(),
            stops: '0,1,2',
            currency: 'USD',
        }

        let returnParams: ExternalFlightsAPIParametersModel = {
            adults: requirements.adults,
            destination: requirements.origin.IATA,
            origin: requirements.destination.IATA,
            departureDate: requirements.startDate.toISOString(),
            stops: '0,1,2',
            currency: 'USD',
        }

        if (infants > 0 || children > 0) {
            const kids = infants + children;  
            if (kids <= 8) {
              this.createChildsInParams(departureParams, 0, infants, 1);
              this.createChildsInParams(departureParams, infants, kids, 10);
              this.createChildsInParams(returnParams, 0, infants, 1);
              this.createChildsInParams(returnParams, infants, kids, 10);
            }
        }
    
        let departureSegments: any[] = [];
        let returnSegments: any[] = [];
        while (end.getTime() - durationMils + 1440 * 60000 >= start.getTime()) {
            const rt = new Date(start);
            const h = new Date(rt.setDate(rt.getDate() + duration - 1));
            var startString = start.toISOString().slice(0, 10);
            var endString = h.toISOString().slice(0, 10);

            departureParams.departureDate = startString;
            let statusDep = "incomplete"
            let dep: any;
            let d = 0;

            //while (statusDep != "complete") {
                console.log("dep", d++);
                //await setTimeout(20000);
                dep = await this.getFlightsFromExternalAPI(departureParams);
                statusDep = dep.context.status;
            //}

            departureSegments = departureSegments.concat(dep.itineraries.results);
            returnParams.departureDate = endString
            let statusRet = "incomplete"
            let ret: any;
            let c = 0;
            //while (statusRet != "complete") {
                console.log("ret", c++ )
            //    await setTimeout(20000);
                ret = await this.getFlightsFromExternalAPI(returnParams);
                statusRet = ret.context.status;
            //}

            returnSegments = returnSegments.concat(ret.itineraries.results);
            start.setDate(start.getDate() + 1);
        }

        return [departureSegments, returnSegments];
    }

    createChildsInParams(params: ExternalFlightsAPIParametersModel, lower: number, upper:number, age: number) {
        for (let i = lower; i < upper; i++) {
          const str = "childAge" + (i+1) as keyof ExternalFlightsAPIParametersModel
          params[str] = age;
        }
    }

    getExternalApiInformation(query: Object): Promise<any> {
        const promise = axios.request(query);
        const dataPromise = promise
            .then((response: any) => response.data)
            .catch((error: Error) => error);
        return dataPromise;
    }
}