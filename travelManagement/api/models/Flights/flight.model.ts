import { Aeroline } from "./aeroline.model";

export interface Flight {
    id: string;
    duration: number;
    departureDate: string;
    arrivalDate: string;
    aeroline: Aeroline;
}