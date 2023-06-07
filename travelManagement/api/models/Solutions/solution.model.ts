import { flightSolutionModel } from "./flightSolution.model";
import { lodgingSolutionModel } from "./lodgingSolution.model";

export interface Solution {
    departure: flightSolutionModel;
    return: flightSolutionModel;
    lodging: lodgingSolutionModel;
}