// Require Modules
const chalk = require ('chalk');
const geocode = require('./geocode');
const weatherApi = require('./weatherApi');
const utils = require('./utils');

// Initializers
const init = () => {
    const yBB = (str) => {console.log(chalk.bold.yellowBright(str))};
    yBB('========= APP START ==========\n');

    // const location = process.argv[2];
    // const country = process.argv[3];
    const [ , , location, country] = process.argv;

    if(location && country)
        main(location, country)
            .then(res => {
                console.log(`Result: ${res}`);
            });
    else
        console.error('Enter location and country');
};


// MAIN
const main = async (location, country, limit = 1) => {
    
    let lat, lon;
    let result;
    let fatalError = false;
    // Get Weather Data
    let scode = utils.getShortCode(country);
    // Get Coordinates
    await geocode.getCoordinates(location, scode, limit)
    .then (res => {
        [lat, lon] = res;
    })
    .catch (err => {
        fatalError = true;
        if(err.response){
            console.log('getCoordinates: Unable to fetch response');
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
        }
        else if(err.request) {
            console.log('getCoordinates: Unable to send request');
        }
        else
            console.log(`ERROR: ${err.message}`);
    });

    // Get weather url -> data
    const url = weatherApi.getURL(lat, lon, 'metric', 'en');
    await weatherApi.getData(url)
        .then (res => {
            // Parse Data
            const data = utils.parseData(res);
            // // Display
            // utils.displayData(data);
            result = data;
        })    
        
    .catch(err => {
        fatalError = true;
        if(err.response) {
            console.log('getData: Unable to fetch Data');
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
            console.log(`Error: ${err.message}`);
            throw err.message;
        }
        else if (err.request) {
            console.log('getData: Unable to send request');
            console.log(`Error: ${err.message}`);
        }
        else
        console.log(`Error: ${err.message}`);
    });

    // fail-safe: in-case throw statement not used
    if(fatalError){
        console.error("Fatal Error - Check Log");
        throw "API Error";
    }

    
    return result;

};

// init();


module.exports = {
    main
};
// yBB('============ EXIT ============\n');