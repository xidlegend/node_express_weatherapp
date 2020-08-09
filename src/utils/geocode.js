const encodeurl = require('encodeurl');
const axios = require('axios');

async function getCoordinates(location, countryCode, limit) {
    const url = getURL(location, countryCode, limit);
    const response = await axios.get(url);
    const coordinates = parseData(response);
    const [lon, lat] = coordinates[0];
    return [lat, lon];
}

// Local Functions
const getURL = (location, country, limit) => {
    // Access Token
    const accessToken = 'pk.eyJ1IjoieGlkbGVnZW5kIiwiYSI6ImNrY2k3dXl1bTB3cTUycnFxY2NuZzRsNTUifQ.Ina0jPSsCSwARPKsaOGjJw';

    // Parse Location
    if(location) {
        location = encodeurl(location);
    } else {
        console.error('Provide a location!');
        return;
    }

    // Parse Optional Parameters
    if(country) { 
        country = `country=${encodeurl(country)}&`;
    } else {
        country = '';
    }
    if(limit) { 
        limit = `limit=${limit}&`;
    } else {
        limit = '';
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?${country}${limit}access_token=${accessToken}`;
    // Return URL
    return url;
};

const parseData = (data) => {
    let arr = [];
     data.data.features.forEach(result => {
        arr.push(result.center);
    });
    return arr;
}

module.exports = {
    getCoordinates,
};