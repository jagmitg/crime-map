# UK Crime Map - React Project

This project is a visualization tool that displays crime data from the UK using data from the [Police UK API](http://data.police.uk/api/). As users zoom in on specific areas within the map, more detailed crime data is revealed.

## Features:

- **Dynamic Data Visualization**: As you interact with the map and zoom in, the granularity of the crime data increases, providing more detailed insights for specific areas.
- **All Types of Crimes**: The app encompasses all categories of crimes available through the Police UK API, allowing users to get a comprehensive overview or filter by specific crime types.
- **Google Maps Integration**: The data is visualized using the Google Maps API, ensuring a familiar and intuitive user interface for users.

## Technology Stack:

- React (v18.2.0) - A JavaScript library for building user interfaces
- React DOM (v18.2.0) - React package for working with the DOM
- React Scripts (v5.0.1) - Scripts and configurations used by Create React App
- Google Maps API - For map visualizations and interactions
- Police UK API - Provides crime data by region, area, and specific location in the UK

## Setup:

1. **Clone the Repository**:
    ```bash
    git clone [repository-link]
    ```

2. **Install Dependencies**: Navigate to the project root directory and run:
    ```bash
    npm install
    ```

3. **Setup API Keys**:
    - For **Google Maps API**: Obtain your API key from the [Google Cloud Console](https://console.cloud.google.com/) and replace `<YOUR_GOOGLE_MAPS_API_KEY>` in the `.env` file or appropriate configuration location.
    - The **Police UK API** does not require an API key as of the last update. However, ensure you abide by their terms of service.

4. **Start the Development Server**:
    ```bash
    npm start
    ```

5. Open your browser and navigate to `http://localhost:3000`.

## Contribution:

Contributions are always welcome! Please read the contribution guidelines and code of conduct beforehand.

## License:

[MIT License](LICENSE)

## Acknowledgments:

- Thanks to the [Police UK API](http://data.police.uk/api/) team for providing comprehensive crime data.
