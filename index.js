// Add Dependancies
const fs            = require('fs');
const path          = require('path');
const express       = require('express');
const bodyParser    = require("body-parser");
const createError   = require('http-errors');
const cors          = require('cors');
const serveIndex    = require('serve-index');
const compression   = require('compression');
const minify        = require('html-minifier').minify;
const ejs           = require('ejs');

// Constants and global scoped variables
const app = express();
global.config = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
global.database = require('./src/database.js');

// Configure Express Settings
app.use(compression());

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600 }));
app.use('/uploads', serveIndex(path.join(__dirname, 'public/uploads')));

const minifyOptions = {
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
    removeComments: true,
    collapseWhitespace: true,
};

app.engine('ejs', function (filePath, data, callback) { // define the template engine
    ejs.renderFile(filePath, data, {}, function(err, page) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        return callback(null, minify(page, minifyOptions));
    });
})

app.set('views', path.join(__dirname, 'views')); // specify the views directory
app.set('view engine', 'ejs'); // register the template engine

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
    if (req.url.toLowerCase().startsWith("/api/")) {
        res.locals.message = err.message;
        res.writeHead(err.status || 500, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(error));
        res.end();
    } else {
        res.render('templates/centered', { page: { title: error.status + " " + error.message }, error: error, content: { body: 'error' } });
    }
});

app.listen(global.config.port, function () {
    console.log(`Server Listening at: http://localhost:${global.config.port}`);
    require('opn')(`http://localhost:${global.config.port}`);
});