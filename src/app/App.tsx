import React, { Component } from "react";

import PositionService from "../services/PositionService";
import UKPoliceData from "../services/UKPoliceData";

import GoogleMap from "../components/maps/GoogleMap";
import KeyList from "../components/keylist/KeyList";

import "./App.css";

const defaultValues = {
    position: {
        lat: 51.544486,
        lng: -0.195038
    },
    api: "CRIMES_STREET"
};

interface AppState {
    // Placeholder for any state variables you might add
}

interface AppProps {
    // Placeholder for any props you might pass into App
}

class App extends Component<AppProps, AppState> {
    private map: google.maps.Map | null;
    private dataService: UKPoliceData;
    private selector: google.maps.Marker | null;
    private keyListRef = React.createRef<KeyList>();

    constructor(props: AppProps) {
        super(props);

        this.map = null;
        this.dataService = new UKPoliceData();
        this.selector = null;
    }

    setLocation(position?: { lat: number; lng: number }) {
        let pos = position || defaultValues.position;

        this.map?.setCenter(pos);
        this.dataService.setCenter(pos);
    }

    setCurrentLocation() {
        let positionService = new PositionService();

        positionService
            .getCurrentPosition()
            .then((position) => {
                this.setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            })
            .catch(() => {
                this.setLocation();
            });
    }

    renderCrimes() {
        this.dataService.getCrimes().then((crimes) => {
            let markers = crimes.map((crime) => {
                crime.map = this.map;
                return new window.google.maps.Marker(crime);
            });

            new window.MarkerClusterer(this.map!, markers, {
                imagePath: "/images/m",
                minimumClusterSize: 5
            });

            this.keyListRef.current?.setState({
                categories: this.dataService.getCategories() // Updated line
            });
        });
    }

    mapLoaded = (map: google.maps.Map) => {
        this.map = map;
        this.selector = new window.google.maps.Marker({
            position: defaultValues.position,
            draggable: true,
            map: this.map
        });

        this.setLocation();
        this.renderCrimes();
    };

    render() {
        return (
            <div className="App">
                <div className="App-sidebar">
                    <h3>Key</h3>
                    <p>
                        Numbers (in circles) display clusters of crime locations.
                        <br />
                        The number represents the quantity of crime locations in each cluster.
                        <br />
                        <br />
                        Letters (in markers) represent the kind of crime on that location, with the following
                        values:
                    </p>
                    <KeyList ref="keys" />
                </div>
                <div className="App-main">
                    <header className="App-header">
                        <h1 className="App-title">React UK Crime Map</h1>
                    </header>
                    <div className="App-body">
                        <GoogleMap onLoad={this.mapLoaded} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
