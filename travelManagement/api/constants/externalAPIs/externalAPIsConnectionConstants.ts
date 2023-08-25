import * as dotenv from "dotenv";
dotenv.config()

const username = process.env.API_USER;
const password = process.env.API_KEY;

export class ExternalAPIsConnectionConstants {

    public static readonly lodgingsExternalAPI = {
        url: 'https://airbnb13.p.rapidapi.com/search-location',
        headers: {
            'X-RapidAPI-Key': '603e891f9emshb24af355cf30aadp13595fjsn84c2e8bb5704',
            'X-RapidAPI-Host': 'airbnb13.p.rapidapi.com',
        }
    }

    public static readonly flightsExternalAPI = {
        url: `https://${username}:${password}@crawler2api.com/skyscanner/search-extended?`,
    }
}