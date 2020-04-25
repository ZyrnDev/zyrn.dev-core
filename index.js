// Add Dependancies
const express       = require('express');
const bodyParser    = require("body-parser");
const createError   = require('http-errors');
const cors          = require('cors');
const fs            = require('fs');

// Constants and global scoped variables
const app = express();
global.config = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
global.database = require('./src/database.js');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', require('./routes/core.js'));

//Catch Errors
app.use(function(req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.writeHead(err.status || 500, {'Content-Type': 'application/json'});

    let error = {
        status: err.status,
        message: err.message,
        request: {
            method: req.method,
            uri: req.headers.host + req.url,
            body: JSON.stringify(req.body)
        }
    };
    
    res.write(JSON.stringify(error));
    res.end();
});

app.listen(global.config.port, () => console.log(`Server Listening at: http://localhost:${global.config.port}`));