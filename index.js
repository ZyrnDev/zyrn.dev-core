// Add Dependancies
const express       = require('express');
const bodyParser    = require("body-parser");
const createError   = require('http-errors');
const cors          = require('cors');
const fs            = require('fs');
const path          = require('path');
const serveIndex    = require('serve-index');

// Constants and global scoped variables
const app = express();
global.config = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
global.database = require('./src/database.js');

// Configure Express Settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', serveIndex(path.join(__dirname, 'public/uploads')));


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add the primary route
app.use('/', require('./routes/core.js'));

//Catch Errors
app.use(function(req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {

    let error = {
        status: err.status || 500,
        message: err.message,
        request: {
            method: req.method,
            uri: req.headers.host + req.url,
            body: req.body
        }
    };

    // If the request was to the API send a json error, otherwise use a human readable one
    if (req.url.toLowerCase().startsWith("/api")) {
        res.locals.message = err.message;
        res.writeHead(err.status || 500, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(error));
        res.end();
    } else {
        res.render('error', { page: { title: error.status + " " + error.message }, error: error })
    }
});

app.listen(global.config.port, () => console.log(`Server Listening at: http://localhost:${global.config.port}`));