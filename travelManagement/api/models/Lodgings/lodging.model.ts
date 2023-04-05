import { Feature } from "./feature.model";
import { Policy } from "./policy.model";
import { LodgingPrice } from "./price.lodging.model";

export interface Lodging {
    id: string;
    startDate: number;
    endDate: number;
    people: number;
    bathrooms: number;
    bedrooms: number
    beds: string;
    isSuperhost: boolean;
    //reviewsCount: number;
    rating: number;
    features: number[];
    cancelPolicies: number;
    price: number;
}