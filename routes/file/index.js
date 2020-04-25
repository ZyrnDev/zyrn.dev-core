const createError   = require('http-errors');
const express       = require('express');
const formidable    = require('formidable');
const fs            = require('fs');
const path          = require('path');
const serveIndex    = require('serve-index');
const serveStatic   = require('serve-static');
const passport      = require('passport');

// My files
const initializePassport = require('./auth.js');

// sudo chmod 777 -R /share
const KILOBYTE = 1024;
const MEGABYTE = KILOBYTE * 1024;
const GIGABYTE = MEGABYTE * 1024;

// const images = ['png', 'jpg', 'tif', 'gif'];
// const videos = ['mp4', 'm4p', 'm4v', 'gif', 'mkv', 'webm', 'mov', 'qt', 'flv', 'swf', 'avi', 'ogg', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv'];

const port = 9002;
const users = [];
var next_userID = 0;
const app = express();

// initializePassport(
//     passport,
//     username => users.find(user => user.username === username),
//     id => users.find(user => user.id === id)
// );
// app.use(passport.initialize())

//app.set('trust proxy', 'uniquelocal, 192.168.1.150');

app.use(function(req, res, next) {
    /*console.log(req.headers['x-original-uri']);*/
    if (req.headers['x-original-uri']) {
        req.originalUrl = req.headers['x-original-uri'] || undefined
    }
    next();
});

// fs.mkdirSync(__dirname + '/uploads/', { recursive: true });

app.use('/uploads', serveStatic('uploads', { 'index': false }), serveIndex('uploads'));
            
function sendSuccess(res, file) {
    res.write('<h1>File was uploaded successfully.</h1>');
    res.write('<a href="uploads/' + file.name + '"><p id="link"></p></a>')
    res.write('<a href="uploads/' + file.name + '"><p>Download</p></a></br>');
    res.write('<a href="/file"><p>Home</p></a>');
    res.write('<script>');
    res.write(' function setLink() {');
    res.write('    document.getElementById("link").innerHTML=window.location.href+"uploads/'+file.name+'";');
    res.write(' };');
    res.write(' setLink();');
    res.write('</script>');
    res.end();
}

function sendFailure(res) {
    res.status(500);
    res.write('<h1>File uploaded failed.</h1>');
    res.end();
}

app.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(
        '<h1>Upload a File</h1' +
        '<p>'+
        '<form method="POST" enctype="multipart/form-data">'+
        ' <input type="file" name="document" />'+
        ' </br>'+
        ' <input type="submit" value="Upload" />'+
        '</form>'+
        '</p>'+
        '<p>'+
        '<a href="/file/uploads/"><h2>View All Files</h2></a>'+
        '</p>'
    );

    res.end();
});

// app.get('/login', (req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write(
//         '<form method="POST">'+
//         '    <div>'+
//         '        <label>Username:</label>'+
//         '        <input type="text" name="username"/>'+
//         '    </div>'+
//         '    <div>'+
//         '        <label>Password:</label>'+
//         '        <input type="password" name="password"/>'+
//         '    </div>'+
//         '    <div>'+
//         '        <input type="submit" value="Log In"/>'+
//         '    </div>'+
//         '</form>'
//     );
//     res.end();
// });
// app.post('/login', (req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write(
//         'Good Job you logged in.'
//     );
//     res.end();
// });

app.post('/', (req, res) => {
   res.writeHead(200, {'Content-Type': 'text/html'});
   let form = new formidable.IncomingForm();
   form.uploadDir = __dirname + '/uploads/'
   form.maxFileSize = 5 * GIGABYTE;
   form.hash = 'sha1';
   form.parse(req)
   form.on('fileBegin', (name, file) => {
        file.path = form.uploadDir + file.name;
    });
    form.on('file', (name, file) => {
        try {
            fs.chmod(file.path, 0o777, (err) => {
                if (err) throw err;
            });
            sendSuccess(res, file);
        } catch (err) {
            sendFailure(res);
        }
        
    });
    form.on('error', function(err) {
        console.error('Something went wrong in uploading file:', err);
        sendFailure(res);
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.writeHead(err.status || 500);
  res.write('<div style="text-align: center;">');
  res.write('<h1>Error: ' + err.status + '</h1>');
  res.write('<p>Message: ' + err.message + '</p>');
  res.write('<p><h4>Request: </h4>' + req.method + ' ' + req.headers.host + req.url + '</p>');
  res.write('<p><h4>Body: </h4>' + JSON.stringify(req.body) + '</p>');
  res.write('</div>');
  res.end();
});

exports = app;

app
.listen(port, () => {
    console.log("Server Started. \nOpen localhost:" + port + " in your browser to view the page.\nListening on Port: " + port + "\nPress Ctrl + C to stop the server.\n")
});
