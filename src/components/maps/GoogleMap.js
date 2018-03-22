import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader';

const defaultValues = {
    position: {
        lat: 51.544486,
        lng: -0.195038
    }
};

/**
 * This component waits until the external libraries are loaded
 * then it initializes the map and calls the methods
 * onLoad or onError
 */
class GoogleMap extends Component {

    /**
     * @implements
     * Callback for the script loader
     * 
     * @param {Boolean} args Bindings for the script loader
     */
    componentWillReceiveProps({ isScriptLoaded, isScriptLoadSucceed }) {

        if (isScriptLoaded && !this.props.isScriptLoaded) {

            if (isScriptLoadSucceed) {

                this.props.onLoad(
                    new window.google.maps.Map(this.refs.map, {
                        center: defaultValues.position,
                        zoom: 14
                    })
                );

            } else {

                this.props.onError();

            }

        }

    }

    render() {

        return (
            <div ref="map" style={{ height: '100%' }}></div>
        );

    }

}

export default scriptLoader(
    [
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo',
        'http://googlemaps.github.io/js-marker-clusterer/src/markerclusterer.js'
    ]
)(GoogleMap);
