import { Score } from "./score.model";

export interface Agent {
    id: number;
    name: string;
    isCarrier: boolean;
    score: Score;
}