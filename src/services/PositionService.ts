// Importing or defining necessary types
type PositionError = GeolocationPositionError;

class PositionService {
    getCurrentPosition(): Promise<GeolocationPosition> {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position: GeolocationPosition) => {
                        resolve(position);
                    },
                    (error: PositionError) => {
                        // User didn't allow Geolocation or other error
                        console.info(`Geolocation error: ${error.message}`);
                        reject(error);
                    }
                );
            } else {
                // Browser doesn't support Geolocation
                console.info("Browser doesn't support Geolocation");
                reject(new Error("Geolocation is not supported by this browser."));
            }
        });
    }
}

export default PositionService;
