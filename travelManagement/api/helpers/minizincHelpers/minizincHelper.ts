import { IModelParams, IResult, IMiniZincSolveRawOptions } from 'minizinc';
import CLIMiniZinc from 'minizinc/build/CLIMiniZinc';
import { MinizincInputDataConstants } from '../../constants/minizinc/MinizincInputDataConstants';
import { Solution } from '../../models/Solutions/solution.model';
import { FlightsDatabase } from '../../dataBase/flightsDatabase';
import { LodgingsDatabase } from '../../dataBase/lodgingsDatabase';
import { SolverSolution } from 'models/Solutions/solverSolution.model';

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

	async getSolutions(
		paths: any[],
		timeFlights: number,
		timeLodgings: number
	): Promise<Solution[] | any> {
		console.log('getting all solutions');
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
		/*const modelInputData = fs.readFileSync(
			path.resolve(
				__dirname,
				'../../../minizincModel/modelInputData4.dzn'
			),
			'utf-8'
		);*/

		let modelsResponses = await this.implementModel(
			String(modelInputData),
			timeFlights,
			timeLodgings
		);
		console.log('modelResponsesnoFiltered', modelsResponses);
		let solutionsForReturn = modelsResponses.filter((modelResp) => modelResp.status == 'OPTIMAL_SOLUTION');
		solutionsForReturn = this.deleteRepeatedSolutions(solutionsForReturn)

		return [solutionsForReturn, modelsResponses];
	}

	deleteRepeatedSolutions(minizincResponses: SolverSolution[]) {
		const solutions = new Map();
		minizincResponses.forEach((mznResponse) => {
		  const key = JSON.stringify(mznResponse.solution);
		  if (!solutions.has(key)) {
			solutions.set(key, mznResponse);
		  }
		});
		return Array.from(solutions.values());
	  }

	async implementModel(
		apiData: string,
		timeFlights: number,
		timeLodgings: number
	) {
		const solvers = ['Gecode', 'Chuffed', 'OR-tools', 'COIN-BC'];
		let allSolutions: any[] = [];

		for (let i = 0; i < solvers.length; i++) {
			console.log('Solving using ', solvers[i]);
			const myModel: IModelParams = {
				model: String(minizincModel),
				solver: solvers[i],
				all_solutions: false,
			};

			const minizinc = new CLIMiniZinc();
			const startTime = performance.now();
			const timeoutAfter = () => {
				return new Promise((resolve: any, reject: any) => {
					setTimeout(() => reject(new Error('Time limit exceeded')), 180000);
				});
			};
			let solverSolution: SolverSolution;
			const mznPromise: Promise<IResult> = minizinc.solve(myModel, apiData);
			try {
				const mznResponse = await Promise.race([mznPromise, timeoutAfter()]);

				const endTime = performance.now();
				const elapsedTime = endTime - startTime;
				solverSolution = this.createSolverSolution(
					mznResponse,
					solvers[i],
					elapsedTime,
					timeFlights,
					timeLodgings
				);
			} catch (error) {
				const endTime = performance.now();
				const elapsedTime = endTime - startTime;
				solverSolution = {
					solver: solvers[i],
					status: error.message,
					solveTimeMzn: 180000,
					solveTimeSystem: Number(elapsedTime.toFixed(3)),
					skyscannerTime: timeFlights,
					airbnbTime: timeLodgings,
				};
			}

			allSolutions = allSolutions.concat(solverSolution);
			console.log('Solution finsihed in ', solvers[i]);
		}
		return allSolutions;
	}

	createSolverSolution(
		mznResponse: any,
		solverName: string,
		solveTimeSys: number,
		timeFlights: number,
		timeLodgings: number
	) {
		const respString = mznResponse.solutions[0].extraOutput;
		const status = mznResponse.status;

		let solverSolution: SolverSolution = {
			solver: solverName,
			status: status,
			solveTimeMzn: mznResponse.statistics
				? Number((mznResponse.statistics.solveTime * 1000).toFixed(3))
				: null,
			solveTimeSystem: Number(solveTimeSys.toFixed(3)),
			skyscannerTime: timeFlights,
			airbnbTime: timeLodgings,
		};

		if (status === 'OPTIMAL_SOLUTION') {
			const jsonStartResp = respString.indexOf('{');
			const trimmedString = respString.substring(jsonStartResp);
			const fixedString = trimmedString.replace(/'/gi, '"');
			const jsonSolution = JSON.parse(fixedString);
			const sol: Solution = jsonSolution;

			solverSolution.solution = sol;
		}

		return solverSolution;
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
