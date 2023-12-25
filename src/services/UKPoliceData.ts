const rootPath: string = "https://corsproxy.io/?http://data.police.uk/api/";
const apiPaths: { CRIMES_STREET: string } = {
    CRIMES_STREET: "/crimes-street/all-crime"
};

let labels: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    categoriesNumber: number = 0;

interface IState {
    api: string;
    lat: number;
    lng: number;
}

interface ICategories {
    [key: string]: string;
}

interface IPosition {
    lat: number;
    lng: number;
}

interface ISpot {
    position: IPosition;
    title: { [key: string]: number };
}

/**
 * This class provides methods to set and fetch
 * the query for the UK Police Data API
 *
 * @class
 */
class UKPoliceData {
    private state: IState;
    private categories: ICategories;

    constructor() {
        this.state = {
            api: "CRIMES_STREET",
            lat: 51.5421,
            lng: -0.20255
        };

        this.categories = {};
    }

    setApi(api: string): void {
        this.state.api = api;
    }

    setCenter(pos: { lat: number; lng: number }): void {
        this.state.lat = pos.lat;
        this.state.lng = pos.lng;
    }

    getCategory(category: string): string {
        let cat: string | number, res: number;

        if (!this.categories[category]) {
            categoriesNumber++;

            res = Math.floor(categoriesNumber / labels.length);
            cat = categoriesNumber % labels.length;

            this.categories[category] = labels.charAt(res) + labels.charAt(cat);
        }

        return this.categories[category];
    }

    getCrimes(): Promise<any[]> {
        let url: string = rootPath + apiPaths[this.state.api],
            lat: number = this.state.lat,
            lng: number = this.state.lng;

        url += `?lat=${lat}&lng=${lng}`;

        return fetch(url)
            .then((response) => response.json())
            .then((crimes) => {
                let crimeSpots: { [key: string]: ISpot } = crimes.reduce((spot: any, crime: any) => {
                    let locationKey: string = `${crime.location.latitude},${crime.location.longitude}`;
                    let location: IPosition = {
                        lat: parseFloat(crime.location.latitude),
                        lng: parseFloat(crime.location.longitude)
                    };

                    if (!spot[locationKey]) {
                        spot[locationKey] = { position: location, title: {} };
                    }

                    spot[locationKey].title[crime.category] =
                        (spot[locationKey].title[crime.category] || 0) + 1;

                    return spot;
                }, {});

                let spots: any[] = Object.values(crimeSpots)
                    .sort((a: ISpot, b: ISpot) => {
                        let sizeA = Object.keys(a.title).length,
                            sizeB = Object.keys(b.title).length;

                        return sizeA - sizeB;
                    })
                    .map((crime: ISpot) => {
                        crime.title = Object.keys(crime.title).join(" | ");
                        crime.label = this.getCategory(crime.title);

                        return crime;
                    });

                return spots;
            });
    }
}

export default UKPoliceData;
