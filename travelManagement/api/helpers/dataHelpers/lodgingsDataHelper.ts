import { ExternalAPIsConstants } from "../../constants/externalAPIs/externalAPIsConstants";
import { Lodging } from "../../models/Lodgings/lodging.model";
import { Policy } from "../../models/Lodgings/policy.model";
import { InputDataHelper } from './inputDataHelper';

export class LodgingsDataHelper {

    inputDataHelper = new InputDataHelper()
    amountOfLodgings = 0;
    largestAmountOfFeatures = 0;

    createLodgingsPaths(lodgings: any[]) {
        const lodgingsPaths = this.createLodgingsArrays(this.createLodgings(lodgings));
        this.amountOfLodgings = lodgingsPaths[0].length;
        return lodgingsPaths;
    }

    createLodgings(lodgings: any[]) {
        let lod: Lodging[] = [];
        lodgings.filter((lodge) => lodge !== undefined).forEach(
            (lodge) => {
                const url = lodge.url;
                const urlLarg = url.length;
                const deeplink = lodge.deeplink;
                const deepLarg = deeplink.length;
                const start = deeplink.slice(urlLarg + 10, urlLarg + 20);
                const end = deeplink.slice(urlLarg + 31, urlLarg + 41);
                const feat = this.changeIdInRepeteadElements(lodge.amenityIds);
                const lodging: Lodging = {
                    id: `"${lodge.id}"`,
                    startDate: this.inputDataHelper.createDateDays(start),
                    endDate: this.inputDataHelper.createDateDays(end),
                    people: lodge.persons,
                    bathrooms: lodge.bathrooms? Math.floor(lodge.bathrooms) : 0,
                    bedrooms: lodge.bedrooms? lodge.bedrooms : 0,
                    beds: lodge.beds ? lodge.beds : 0,
                    isSuperhost: lodge.isSuperhost,
                    rating: lodge.rating ? Math.round(lodge.rating * 100) : -1,
                    features: feat.filter((feature: any) =>
                        ExternalAPIsConstants.featuresId.includes(feature)
                    ),
                    cancelPolicies: this.createPolicies(lodge.cancelPolicy),
                    price: lodge.price.total,
                };
                if (lodging.features.length > this.largestAmountOfFeatures) {
                    this.largestAmountOfFeatures = lodging.features.length;
                }
                lod.push(lodging);
            }
        )
        return lod;
    }

    changeIdInRepeteadElements(features: number[]) {
        features = features.map((feature: any) => {
            if (feature == 2) {
                return 8;
            } else if (feature == 115 || feature == 120 || feature == 127) {
                return 110;
            } else if (feature == 128) {
                return 116;
            } else {
                return feature;
            }
        });

        return features;
    }
    
    createPolicies(cancelPolicy: string) {
        const cancelPolicies = ExternalAPIsConstants.cancelPolicies;
        let policy: Policy | undefined = cancelPolicies.find(
            (pol: Policy) => pol.name === cancelPolicy
        );
        if (!policy) {
            return 1;
        }
        return policy.id;
    }
    
    createLodgingsArrays(lodgings: any[]) {
        let lodgingsId: any[] = [];
        let lodgingsStartDate: any[] = [];
        let lodgingsEndDate: any[] = [];
        let lodgingsPeople: any[] = [];
        let lodgingsBathrooms: any[] = [];
        let lodgingsBedrooms: any[] = [];
        let lodgingsBeds: any[] = [];
        let lodgingsIsSuperhost: any[] = [];
        let lodgingsRating: any[] = [];
        let lodgingsFeatures: any[] = [];
        let lodgingsCancelPolicy: any[] = [];
        let lodgingsPriceTotalAmount: any[] = [];
    
        for (let i = 0; i < lodgings.length; i++) {
            lodgingsId.push(lodgings[i].id);
            lodgingsStartDate.push(lodgings[i].startDate);
            lodgingsEndDate.push(lodgings[i].endDate);
            lodgingsPeople.push(lodgings[i].people);
            lodgingsBathrooms.push(lodgings[i].bathrooms);
            lodgingsBedrooms.push(lodgings[i].bedrooms);
            lodgingsBeds.push(lodgings[i].beds);
            lodgingsIsSuperhost.push(lodgings[i].isSuperhost);
            lodgingsRating.push(lodgings[i].rating);
            if (this.largestAmountOfFeatures > lodgings[i].features.length) {
                const featuresLength = lodgings[i].features.length;
                for (let j = 0; j < this.largestAmountOfFeatures - featuresLength; j++) {
                    lodgings[i].features.push(-1);
                }
            }
            lodgingsFeatures.push(lodgings[i].features);
            lodgingsCancelPolicy.push(lodgings[i].cancelPolicies);
            lodgingsPriceTotalAmount.push(lodgings[i].price * 100);
        }
        return [
            lodgingsId,
            lodgingsStartDate,
            lodgingsEndDate,
            lodgingsPeople,
            lodgingsBathrooms,
            lodgingsBedrooms,
            lodgingsBeds,
            lodgingsIsSuperhost,
            lodgingsRating,
            lodgingsFeatures,
            lodgingsCancelPolicy,
            lodgingsPriceTotalAmount,
        ];
    }
}