const path = require('path');
const express = require('express');
const axios = require ('axios');
const PORT = process.env.PORT || 3000;

// Weather utils
const weatherMain = require ('./utils/app');

// App instance
const app = express();

// Paths for express config
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, './templates/views');


// set ejs view engine and views location
app.set('view engine', 'ejs');
app.set('views', viewsPath);

    // add static dir to serve, to middleware stack
    app.use(express.static(publicDirPath));

// ============ Get Routes ============ //
app.get('', (req, res) => {
    // name of file in /views
    const content = {
        title: 'Weather',
        name: 'XiD Legend',
    } 
    res.render('index', content);
});


app.get('/weather', (req, res) => {
    // check for address and country
    if(!req.query.address || !req.query.country) {
        return res.send({
            error: 'Please provide a valid address and country'
        });
    }

    weatherMain.main(req.query.address, req.query.country)
        .then(response => {
            return res.json(response);
        })
        .catch(error => {
            console.log('ERROR in route: ' + error);
            res.status(400).send({"error" : error});
        });
});

app.get('/test', (req, res) => {
    
    if(!req.query.search) {
        return res.send({
            error: 'You Must Provide a search term'
        });
    }
    console.log(req.query.search);
    const product = {
        title: 'Shoe',
        name: 'Legend Airy',
    } 
    res.send(product);
});

app.get('/about', (req, res) => {
    const content = {
        title: 'About',
        name: 'XiD Legend',
        content: 'I like cheescakes! Thats all you need to know'
    }; 
    res.render('about', content);
});

app.get('/api', (req, res) => {
    axios.get('http://api.open-notify.org/iss-now.json')
    .then(response => { 
        const content = {
            title: 'API',
            name: 'XiD Legend',
            content: 'The ISS Location API : http://open-notify.org/Open-Notify-API',
            coord: [response.data.iss_position.longitude, response.data.iss_position.latitude]
        }; 
        res.render('api',content);
    }); 
});

app.get('/static', (req, res) => {
    res.sendFile(path.resolve(publicDirPath, 'static.html'));
});

// Rest of routes - 404 - at last
app.get('*', (req, res) => {
    const content = {
        title: '404',
        name: 'XiD Legend',
        content: `OOPS! '${req.path.substr(1, req.path.length)}' page does not exist. Wait... Are you from the future?`
    }; 
    res.render('404', content);
});

// Listen
app.listen(PORT, () => {
    console.log('server running at port ' + PORT);
});

