import { Input } from "../../models/Input/input.model";

export class InputDataHelper {

    translateAvailableTime(requirements: Input) {
        let startTimesHours: number[] = [];
        let startTimesMinutes: number[] = [];
        let endTimesHours: number[] = [];
        let endTimesMinutes: number[] = [];
    
        for (let i = 0; i < requirements.startTime.length; i++) {
            startTimesHours.push(requirements.startTime[i].getHours());
            startTimesMinutes.push(requirements.startTime[i].getMinutes());
            endTimesHours.push(requirements.endTime[i].getHours());
            endTimesMinutes.push(requirements.endTime[i].getMinutes());
        }
    
        return [startTimesHours, startTimesMinutes, endTimesHours, endTimesMinutes];
    }
    
    createRequiredInformation(requirements: Input, inputSizes: any[]) {
        const availableTime = this.translateAvailableTime(requirements);
        const body = inputSizes.concat([
            requirements.maxPrice * 100,
            requirements.maxStops,
            requirements.maxStopsDuration,
            requirements.maxTotalDuration,
            requirements.allowAerolines,
            requirements.allowIntermediaries,
            availableTime[0],
            availableTime[1],
            availableTime[2],
            availableTime[3],
            requirements.bedrooms,
            requirements.beds,
            requirements.bathrooms,
            requirements.isSuperHost,
            requirements.allowPolicies,
            requirements.features,
        ]);
    
        return body;
    }

    createDateDays(dat: string) {
        const firstDate = new Date('2023-01-01');
        const secondDate = new Date(dat);
        const sDateMinutes = secondDate.setUTCHours(0, 0, 0, 0) / 60000;
        const fDateMinutes = firstDate.setUTCHours(0, 0, 0, 0) / 60000;
        const days = (sDateMinutes - fDateMinutes) / 1440;
    
        return days;
    }

}