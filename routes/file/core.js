const KILOBYTE = 1024;
const MEGABYTE = KILOBYTE * 1024;
const GIGABYTE = MEGABYTE * 1024;

const express   = require('express');
const router    = express.Router();

const formidable    = require('formidable');
const fs            = require('fs');
const path          = require('path');

// const images = ['png', 'jpg', 'tif', 'gif'];
// const videos = ['mp4', 'm4p', 'm4v', 'gif', 'mkv', 'webm', 'mov', 'qt', 'flv', 'swf', 'avi', 'ogg', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv'];
            
router.get('/', (req, res) => {
    res.render('templates/centered', { page: { title: "Upload" }, content: { header: 'file/header', body: 'file/index', footer: 'file/index footer' } });
});

router.post('/', (req, res) => {
   let form = new formidable.IncomingForm();
   form.uploadDir = path.join(path.parse(process.mainModule.filename).dir + '/public/uploads/');
   form.maxFileSize = 5 * GIGABYTE;
   form.hash = 'sha1';
   form.parse(req);
   form.on('fileBegin', (name, file) => {
        if (file.name) {
            file.path = form.uploadDir + file.name;
        }
    });
    form.on('file', (name, file) => {
        if (file.name) {
            res.render('templates/centered', { page: { title: "Success" }, content: { header: 'file/header', body: 'file/success' }, file: file });   
        } else  {
            res.render('templates/centered', { page: { title: "Failure" }, content: { header: 'file/header', body: 'file/failure' } });   
        }
    });
    form.on('error', function(err) {
        console.error('Something went wrong in uploading file:', err);
        res.render("file/failure", { page: { title: "Failure" } });
    });
});


module.exports = router;