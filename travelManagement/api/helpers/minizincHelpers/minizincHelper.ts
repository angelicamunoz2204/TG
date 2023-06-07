import { IModelParams, IResult } from "minizinc";
import CLIMiniZinc from "minizinc/build/CLIMiniZinc";
import { MinizincInputDataConstants } from "../../constants/minizinc/MinizincInputDataConstants";
import { flightSolutionModel } from "../../models/Solutions/flightSolution.model";
import { lodgingSolutionModel } from "../../models/Solutions/lodgingSolution.model";
import { Solution } from "../../models/Solutions/solution.model";
const fs = require('fs');
const path = require('path')
const minizincModel = fs.readFileSync(
	path.resolve(__dirname, '../../../minizincModel/travelManagementMinizinc.mzn'),
	'utf-8'
);

export class MinizincHelper {
    
    minizincDataRequirements = MinizincInputDataConstants.minizincDataRequirements;
    minizincDataRequirementsLong = MinizincInputDataConstants.minizincDataRequirementsLong;
    minizincDataRequirementsDim = MinizincInputDataConstants.minizincDataRequirementsDim;
    minizincDataFlights = MinizincInputDataConstants.minizincDataFlights;
    minizincDataFlightsLong = MinizincInputDataConstants.minizincDataFlightsLong;
    minizincDataFlightsDim = MinizincInputDataConstants.minizincDataFlightsDim;
    minizincDataLodgings = MinizincInputDataConstants.minizincDataLodgings;
    minizincDataLodgingsDim = MinizincInputDataConstants.minizincDataLodgingsDim;
    minizincDataLodgingsLong = MinizincInputDataConstants.minizincDataLodgingsLong;

    async getSolutions(paths:any[]) {
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
        console.log("modelResponse", modelResponse);

        let allSolutions: Solution[] = [];
        const status = modelResponse.status;

        if(status == 'OPTIMAL_SOLUTION') {
            //'UNSATISFIABLE'
            for (let i = 0; i < modelResponse.solutions.length; i++) {
                const sol = modelResponse.solutions[i].extraOutput;
        
                if (sol) {
                    const fixedString = sol.replace(/'/gi, "\"");
                    console.log(fixedString);
                    const jsonSolution = JSON.parse(fixedString);
                    const departure = jsonSolution.Departure;
                    const ret = jsonSolution.Return;
                    const lodging = jsonSolution.Lodging;
                    allSolutions.push(
                       this.getEachModelSolution(
                            departure,
                            ret,
                            lodging
                        )
                    );
                }
            }
        }
    
        return allSolutions;
    }

    getEachModelSolution(
        departure: flightSolutionModel,
        ret: flightSolutionModel,
        lodging: lodgingSolutionModel
    ) {
        const depFlights = fs.readFileSync(path.resolve(__dirname, '../../../APIsData/departureFlights.json'), 'utf-8');
        const retFlights = fs.readFileSync(path.resolve(__dirname, '../../../APIsData/returnFlights.json'), 'utf-8');
        const lodgs = fs.readFileSync(path.resolve(__dirname, '../../../APIsData/lodgings.json'), 'utf-8');
    
        const modelSolution: Solution = {
            departure: departure,
            return: ret,
            lodging: lodging,
        };
    
        return {
            departure: JSON.parse(depFlights)[departure.pos],
            return: JSON.parse(retFlights)[ret.pos],
            lodging: JSON.parse(lodgs)[lodging.pos]
        };
    }
    
    async implementModel(apiData: string) {
        const myModel: IModelParams = {
            model: String(minizincModel),
            solver: 'gecode',
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
    
        var filePath = path.resolve(__dirname, '../../../minizincModel/modelInputData.dzn');
    
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