const KILOBYTE = 1024;
const MEGABYTE = KILOBYTE * 1024;
const GIGABYTE = MEGABYTE * 1024;

const express   = require('express');
const router    = express.Router();

const createError   = require('http-errors');
const formidable    = require('formidable');
const fs            = require('fs');
const path          = require('path');
const serveIndex    = require('serve-index');
const serveStatic   = require('serve-static');


// sudo chmod 777 -R /share

// const images = ['png', 'jpg', 'tif', 'gif'];
// const videos = ['mp4', 'm4p', 'm4v', 'gif', 'mkv', 'webm', 'mov', 'qt', 'flv', 'swf', 'avi', 'ogg', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv'];

router.use('/uploads', serveStatic(path.join(__dirname, 'uploads'), { 'index': false }), serveIndex(path.join(__dirname, 'uploads')));
            
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

router.get('/', (req, res) => {
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

router.post('/', (req, res) => {
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


module.exports = router;