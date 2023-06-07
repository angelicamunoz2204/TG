export class ExternalAPIsConnectionConstants {

    public static readonly lodgingsExternalAPI = {
        url : 'https://airbnb13.p.rapidapi.com/search-location',
        headers: {
            'X-RapidAPI-Key': '603e891f9emshb24af355cf30aadp13595fjsn84c2e8bb5704',
            'X-RapidAPI-Host': 'airbnb13.p.rapidapi.com',
        }
    }
    
    public static readonly flightsExternalAPI = {
        url : 'https://skyscanner44.p.rapidapi.com/search-extended',
        headers: {
            'X-RapidAPI-Key': 'bff5febd22msh6c0f166bebbc3ccp1d84b8jsnada7c2f19410',
            'X-RapidAPI-Host': 'skyscanner44.p.rapidapi.com',
            useQueryString: true,
        }
    }
}