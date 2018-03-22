import React, { Component } from 'react';

import PositionService from '../services/PositionService';
import UKPoliceData from '../services/UKPoliceData';

import GoogleMap from '../components/maps/GoogleMap';
import KeyList from '../components/keylist/KeyList';

import './App.css';

const defaultValues = {
    position: {
        lat: 51.544486,
        lng: -0.195038
    },
    api: 'CRIMES_STREET'
};

/**
 * Application logic wrapper
 * 
 * @class
 */
class App extends Component {

    constructor(props) {

        super(props);

        this.map = null;
        this.dataService = new UKPoliceData();
        this.selector = null;

    }

    /**
     * Sets the position for the service and the map
     * 
     * @param {Object} [position] Object with lat and lng
     */
    setLocation(position) {

        let pos = position || defaultValues.position;

        this.map.setCenter(pos);
        this.dataService.setCenter(pos);

    }

    /**
     * Sets the current position as the position for the service and the map
     */
    setCurrentLocation() {

        let positionService = new PositionService();

        positionService.getCurrentPosition()
            .then(position => {

                this.setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });

            })
            .catch(() => {

                this.setLocation();

            });

    }

    /**
     * Fetches the crimes and renders them as markers in clusters
     */
    renderCrimes() {

        this.dataService.getCrimes().then(crimes => {

            let markers = crimes.map(crime => {

                crime.map = this.map;
                return new window.google.maps.Marker(crime);

            });

            new window.MarkerClusterer(this.map, markers, {
                imagePath: '/images/m',
                minimumClusterSize: 5
            });

            this.refs.keys.setState({
                categories: this.dataService.categories
            });

        });

    }

    /**
     * Handler to communicate the GoogleMap component with the App
     * 
     * @param {GoogleMap} map Map instance
     */
    mapLoaded(map) {

        this.map = map;
        this.selector = new window.google.maps.Marker({
            position: defaultValues.position,
            draggable: true,
            map: this.map
        });

        this.setLocation();
        this.renderCrimes();

    }

    render() {

        return (
            <div className="App">
                <div className="App-sidebar">
                    <h3>Key</h3>
                    <p>
                        Numbers (in circles) display clusters of crime locations.
                        <br />
                        The number represents the quantity of crime locations
                        in each cluster.
                        <br /><br />
                        Leters (in markers) represent the kind of crime on that location,
                        with the following values:
                    </p>
                    <KeyList ref="keys" />
                </div>
                <div className="App-main">
                    <header className="App-header">
                        <h1 className="App-title">React UK Crime Map</h1>
                    </header>
                    <div className="App-body">
                        <GoogleMap onLoad={this.mapLoaded.bind(this)} />
                    </div>
                </div>
            </div>
        )

    }

}

export default App;
