import { Solution } from "./solution.model";

export interface SolverSolution {
    solver: string,
    status: string,
    solution?: Solution,
    solveTimeMzn: number,
    solveTimeSystem: number,
    airbnbTime: number,
    skyscannerTime: number
}