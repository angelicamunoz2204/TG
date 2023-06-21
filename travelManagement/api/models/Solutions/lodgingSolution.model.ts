export interface LodgingSolutionModel {
	id: string,
    pos: number,
    price: number, 
    score: number,
	checkOutDays: number,
	checkInDays: number,
    result?: any
}
