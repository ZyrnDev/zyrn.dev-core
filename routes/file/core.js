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
    res.render("file/success", { page: { title: "Success" }, file: file });
}

function sendFailure(res) {
    res.render("file/failure", { page: { title: "Failure" } });
}

router.get('/', (req, res) => {
    res.render("file/index", { page: { title: "Upload" } });
});

router.post('/', (req, res) => {
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