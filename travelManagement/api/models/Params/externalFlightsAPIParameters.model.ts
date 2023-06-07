export interface ExternalFlightsAPIParametersModel {
    adults: number,
    origin: string,
    destination: string,
    departureDate: string,
    stops: string,
    currency: string,
    childAge1?: number,
    childAge2?: number,
    childAge3?: number,
    childAge4?: number,
    childAge5?: number,
    childAge6?: number,
    childAge7?: number,
    childAge8?: number,
    [key: string]: number | string | undefined;
}