const rootPath: string = "https://corsproxy.io/?http://data.police.uk/api/";
const apiPaths: { [key: string]: string } = {
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
    label?: string;
}

class UKPoliceData {
    private state: IState;
    private categories: ICategories;

    public getCategories() {
        return this.categories;
    }

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
                if (!Array.isArray(crimes)) {
                    throw new Error("Fetched data is not an array");
                }

                let crimeSpots: { [key: string]: ISpot } = crimes.reduce(
                    (spot: { [key: string]: ISpot }, crime: any) => {
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
                    },
                    {}
                );

                let spots: ISpot[] = Object.values(crimeSpots)
                    .sort((a: ISpot, b: ISpot) => {
                        let sizeA = Object.keys(a.title).length,
                            sizeB = Object.keys(b.title).length;

                        return sizeA - sizeB;
                    })
                    .map((crimeSpot: ISpot) => {
                        crimeSpot.label = this.getCategory(Object.keys(crimeSpot.title).join(" | "));
                        return crimeSpot;
                    });

                return spots;
            });
    }
}

export default UKPoliceData;
