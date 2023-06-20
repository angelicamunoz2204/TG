import { IModelParams, IResult } from 'minizinc';
import CLIMiniZinc from 'minizinc/build/CLIMiniZinc';
import { MinizincInputDataConstants } from '../../constants/minizinc/MinizincInputDataConstants';
import { flightSolutionModel } from '../../models/Solutions/flightSolution.model';
import { lodgingSolutionModel } from '../../models/Solutions/lodgingSolution.model';
import { Solution } from '../../models/Solutions/solution.model';
import { FlightsDatabase } from '../../dataBase/flightsDatabase';
import { LodgingsDatabase } from '../../dataBase/lodgingsDatabase';
const fs = require('fs');
const path = require('path');
const minizincModel = fs.readFileSync(
	path.resolve(
		__dirname,
		'../../../minizincModel/travelManagementMinizinc.mzn'
	),
	'utf-8'
);

export class MinizincHelper {
	flightsDB = new FlightsDatabase();
	lodgingsDB = new LodgingsDatabase();
	minizincDataRequirements =
		MinizincInputDataConstants.minizincDataRequirements;
	minizincDataRequirementsLong =
		MinizincInputDataConstants.minizincDataRequirementsLong;
	minizincDataRequirementsDim =
		MinizincInputDataConstants.minizincDataRequirementsDim;
	minizincDataFlights = MinizincInputDataConstants.minizincDataFlights;
	minizincDataFlightsLong = MinizincInputDataConstants.minizincDataFlightsLong;
	minizincDataFlightsDim = MinizincInputDataConstants.minizincDataFlightsDim;
	minizincDataLodgings = MinizincInputDataConstants.minizincDataLodgings;
	minizincDataLodgingsDim = MinizincInputDataConstants.minizincDataLodgingsDim;
	minizincDataLodgingsLong =
		MinizincInputDataConstants.minizincDataLodgingsLong;

	async getSolutions(paths: any[]): Promise<Solution[] | any> {
		const minizincDataName = this.minizincDataRequirements.concat(
			this.minizincDataFlights,
			this.minizincDataLodgings
		);

		const minizincDataLong = this.minizincDataRequirementsLong.concat(
			this.minizincDataFlightsLong,
			this.minizincDataLodgingsLong
		);
		const minizincDataDim = this.minizincDataRequirementsDim.concat(
			this.minizincDataFlightsDim,
			this.minizincDataLodgingsDim
		);
		const dzn = this.createDznFile(
			paths,
			minizincDataName,
			minizincDataLong,
			minizincDataDim
		);
		const modelInputData = fs.readFileSync(dzn, 'utf-8');
		const modelResponse = await this.implementModel(String(modelInputData));
		console.log('modelResponse', modelResponse);

		let allSolutions: Solution[] = [];
		const status = modelResponse.status;

		if (status == 'OPTIMAL_SOLUTION') {
			//'UNSATISFIABLE'
			for (let i = 0; i < modelResponse.solutions.length; i++) {
				const sol = modelResponse.solutions[i].extraOutput;

				if (sol) {
					const trimmedString = sol
						.replace('%%%mzn-stat: openNodes=-1\n', '')
						.replace('%%%mzn-stat: openNodes=-1', '');
					if (trimmedString === '') continue;
					const fixedString = trimmedString.replace(/'/gi, '"');
					const jsonSolution = JSON.parse(fixedString);
					const departure = jsonSolution.Departure;
					const ret = jsonSolution.Return;
					const lodging = jsonSolution.Lodging;
					const posPriceDep = jsonSolution.Departure.posAgent;
					const posPriceRet = jsonSolution.Return.posAgent;
					const resp = await this.getEachModelSolution(
						departure,
						ret,
						lodging,
						posPriceDep,
						posPriceRet
					);
					allSolutions.push(resp);
				}
			}
			return allSolutions;
		}

		return { solution: 'Unsatisfiable' };
	}

	async getEachModelSolution(
		departure: flightSolutionModel,
		ret: flightSolutionModel,
		lodging: lodgingSolutionModel,
		posPriceDep: number,
		posPriceRet: number
	): Promise<Solution> {
		const modelSolution: Solution = {
			departure: departure,
			return: ret,
			lodging: lodging,
			posPriceDeparture: posPriceDep,
			posPriceReturn: posPriceRet,
		};
		const depa = await this.flightsDB.getFlightById(
			'departureFlights',
			departure.id
		);
		const retu = await this.flightsDB.getFlightById('returnFlights', ret.id);
		const lod = await this.lodgingsDB.getLodgingById(
			lodging.id.toString(),
			lodging.checkInDays,
			lodging.checkOutDays
		);
		return {
			departure: depa,
			return: retu,
			lodging: lod,
			posPriceDeparture: posPriceDep,
			posPriceReturn: posPriceRet,
		};
	}

	async implementModel(apiData: string) {
		const myModel: IModelParams = {
			model: String(minizincModel),
			solver: 'Gecode',
			all_solutions: true,
		};

		const minizinc = new CLIMiniZinc();
		const solution: IResult = await minizinc.solve(myModel, apiData);
		return solution;
	}

	createDznFile(
		paths: any[],
		minizincDataName: string[],
		minizincDataLong: number[],
		minizincDataDim: number[]
	) {
		var fileContent: string = '';

		for (let i = 0; i < minizincDataName.length; i++) {
			if (minizincDataLong[i] == 0) {
				fileContent += `${minizincDataName[i]} = ${paths[i]};\n`;
			} else {
				fileContent += `${minizincDataName[i]} = ${this.createDznText(
					paths[i],
					minizincDataLong[i],
					minizincDataDim[i]
				)}`;
			}
		}

		var filePath = path.resolve(
			__dirname,
			'../../../minizincModel/modelInputData.dzn'
		);

		fs.writeFileSync(filePath, fileContent, (err: any) => {
			if (err) throw err;
			console.log('The file was succesfully saved!');
		});

		return filePath;
	}

	createDznText(data: any[], long: number, dim: number) {
		let dataText = '[';

		if (dim === 1) {
			dataText = dataText.concat(data.toString() + '];\n');
		} else {
			dataText = dataText.concat('|');
			for (let i = 1; i <= data.length; i++) {
				for (let j = 0; j < data[i - 1].length; j++) {
					dataText = dataText.concat(data[i - 1][j].toString());
					if (j < data[i - 1].length - 1) {
						dataText = dataText.concat(',');
					} else {
						dataText = dataText.concat('|');
					}
				}
				if (i % long === 0 || i === data.length) {
					if (i === data.length) {
						dataText = dataText.concat('];');
					}
					dataText = dataText.concat('\n');
				}
			}
		}

		return dataText;
	}
}
