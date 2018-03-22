const rootPath = 'http://data.police.uk/api';
const apiPaths = {
    CRIMES_STREET: '/crimes-street/all-crime'
}

var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    categoriesNumber = 0;

/**
 * This class provides methods to set and fetch
 * the query for the UK Police Data API
 * 
 * @class
 */
class UKPoliceData {


    constructor() {

        this.state = {
            api: 'CRIMES_STREET',
            lat: 51.5421,
            lng: -0.20255
        };

        this.categories = {};

    }

    /**
     * Allows to set a different tested api
     * 
     * @param {String} api 
     */
    setApi(api) {

        this.state.api = api;

    }

    /**
     * Allows to set the latitude and longitude to call the service
     * 
     * @param {Object} pos 
     */
    setCenter(pos) {

        this.state.lat = pos.lat;
        this.state.lng = pos.lng;

    }

    /**
     * Generates a new number for each different category,
     * useful to tranform the data
     * 
     * @param {String} category An identifier string
     * @return {String} A new string identifier or the already saved one
     */
    getCategory(category) {

        let cat,
            res;

        if (!this.categories[category]) {

            categoriesNumber++;

            res = Math.floor(categoriesNumber / labels.length);
            cat = categoriesNumber % labels.length;

            this.categories[category] = labels[res] + labels[cat];

        }

        return this.categories[category].toString();

    }

    /**
     * Fetches the crimes and transforms the data
     * by grouping the crimes with the same location
     * 
     * @return {Promise} A promise with the crime locations
     */
    getCrimes() {

        let url = rootPath + apiPaths[this.state.api],
            lat = this.state.lat,
            lng = this.state.lng;

        url += `?lat=${lat}&lng=${lng}`;

        return window.fetch(url)
            .then(response => response.json())
            .then(crimes => {

                var crimeSpots = crimes
                        .reduce((spot, crime) => {

                            let location = [
                                parseFloat(crime.location.latitude),
                                parseFloat(crime.location.longitude)
                            ];

                            spot[location] = spot[location] || {
                                position: {
                                    lat: location[0],
                                    lng: location[1]
                                },
                                title: {}
                            };

                            spot[location].title[crime.category] = 1;

                            return spot;

                        }, {}),
                    spots = Object.values(crimeSpots)
                        .sort((a, b) => {

                            let sizeA = Object.keys(a.title).length,
                                sizeB = Object.keys(b.title).length;

                            return sizeA > sizeB ? 1 : -1;

                        })
                        .map(crime => {

                            crime.title = Object.keys(crime.title).join(' | ');
                            crime.label = this.getCategory(crime.title);

                            return crime;

                        });

                return new Promise((resolve) => resolve(spots));

            });

    }

}

export default UKPoliceData;
