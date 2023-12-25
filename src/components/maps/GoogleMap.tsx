import React, { Component, RefObject } from "react";

// Define the shape of your default values
const defaultValues = {
    position: {
        lat: 51.544486,
        lng: -0.195038
    }
};

// Props and State interfaces
interface GoogleMapProps {
    onLoad?: (map: google.maps.Map) => void; // Optional onLoad function
    onError?: () => void; // Optional onError function
}

interface GoogleMapState {
    scriptsLoaded: boolean;
    scriptsError: boolean;
}

class GoogleMap extends Component<GoogleMapProps, GoogleMapState> {
    private mapRef: RefObject<HTMLDivElement>;

    constructor(props: GoogleMapProps) {
        super(props);
        this.mapRef = React.createRef();
        this.state = {
            scriptsLoaded: false,
            scriptsError: false
        };
    }

    componentDidMount() {
        this.loadScript("https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY")
            .then(() => {
                return this.loadScript(
                    "https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer_compiled.js"
                );
            })
            .then(() => {
                this.setState({ scriptsLoaded: true }, this.initializeMap);
            })
            .catch(() => {
                this.setState({ scriptsError: true });
                if (typeof this.props.onError === "function") {
                    this.props.onError();
                }
            });
    }

    loadScript(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = url;
            script.onload = () => resolve();
            script.onerror = () => reject();
            document.body.appendChild(script);
        });
    }

    initializeMap = () => {
        if (this.state.scriptsLoaded && this.props.onLoad && typeof this.props.onLoad === "function") {
            this.props.onLoad(
                new window.google.maps.Map(this.mapRef.current!, {
                    center: defaultValues.position,
                    zoom: 14
                })
            );
        }
    };

    render() {
        return <div ref={this.mapRef} style={{ height: "100%" }}></div>;
    }
}

export default GoogleMap;
