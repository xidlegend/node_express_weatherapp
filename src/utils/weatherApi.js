const axios = require('axios');

const getURL = (lat, lon, unit, lang) => {
    const APIKEY = 'fb8d791e9d9092caa77da0576b86ac39';
    // api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={your api key}
    return`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=${unit}&lang=${lang}`;
    
};

// Weather -GetURL
const getData = async (url) => {
    return await axios.get(url);
};

module.exports= {
    getURL,
    getData
}