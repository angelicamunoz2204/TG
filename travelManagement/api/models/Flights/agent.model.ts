import { Basic } from '../basic.model'
import { Score } from "./score.model";

export interface Agent extends Basic {
    isCarrier: boolean;
    score: Score;
}