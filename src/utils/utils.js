const fs = require('fs');
const chalk = require('chalk');
const { json } = require('express');

const getShortCode = country => {
    const jsonPath = (__dirname + '\\countryShortCode.json')
    const list = JSON.parse(fs.readFileSync(jsonPath).toString());
    const shortCode = list[country.toLowerCase()];

    // Return If shortCode
    if(shortCode) 
        return shortCode;
    else {
        console.error(chalk.red`Country Not Found in countryShortCode.json`);
        throw 'Country Not Found';
    }
};

const parseData = ({data}) => {
    return {
        place: data.name,
        country: data.sys.country,
        description: data.weather[0].description, 
        temp: data.main.temp, 
        humidity: data.main.humidity, 
        feels_like: data.main.feels_like, 
        rain: `${data.rain ? Math.round(data.rain["1h"]*100) : '0'}`
    };
};

const displayData = (data) => {
    console.log(chalk.bold`\n\n====== WEATHER REPORT ======\n`);
    console.log(chalk.bold(`Currently outside in ${data.place}, ${data.country}: ${data.description}`));
    console.log(`\tTemprature:\t${chalk.green(data.temp)} °C`);
    console.log(`\tHumidity:\t${chalk.magenta(data.humidity)} %`);
    console.log(`\tFeels Like:\t${chalk.red(data.feels_like)} °C`);
    console.log(`${chalk.bold`Rain in the next hour: `}${chalk.blue(data.rain)} cm`);
};

module.exports = {
    getShortCode, 
    displayData, 
    parseData
}
