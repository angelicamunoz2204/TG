export interface Input {
    origin: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    duration: number;
    startTime: Date[];
    endTime: Date[];
    adults: number;
    children: number;
    cabinClass: number;
    maxPrice: number;
    maxStops: number;
    maxStopsDuration: number;
    maxTotalDuration: number;
    allowAerolines: number[];
    allowIntermediaries: boolean;
    minScoreFlights: number;
    minScoreLodging: number;
    beedrooms: number;
    beds: number;
    bathrooms: number;
    isSuperHost: boolean;
    features: number[];
}