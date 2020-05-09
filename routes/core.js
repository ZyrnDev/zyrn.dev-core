const express   = require('express');
const router    = express.Router();

router.get('/', function (req, res) {
    res.render('templates/centered', { page: { title: "Home" }, content: { body: 'index' } });
});

//Routes
router.use('/test', require("./test/core.js"));
router.use('/api', require("./api/core.js"));
router.use('/files?', require("./file/core.js"));
router.use('/realm', require("./realm/core.js"));
router.use('/jokes', require("./jokes/core.js"));

module.exports = router;

