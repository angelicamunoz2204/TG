import { Flight } from "./flight.model";
import { FlightPrice } from "./price.flights.model";

export interface Path {
    id: string;
    stops: number;
    duration: number;
    departureDate: string;
    arrivalDate: string;
    segments: Flight[];
    price: FlightPrice[];
}