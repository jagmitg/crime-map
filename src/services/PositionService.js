class PositionService {

    getCurrentPosition() {

        return new Promise((resolve, reject) => {

            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(position => {

                    resolve(position);

                }, () => {

                    // User didn't allow Geolocation
                    console.info('User didn\'t allow Geolocation');
                    reject();

                });

            } else {

                // Browser doesn't support Geolocation
                console.info('Browser doesn\'t support Geolocation');
                reject();

            }

        });

    }

}

export default PositionService;
