const express   = require('express');
const router    = express.Router();

router.get('/', function (req, res) {
    res.send("You reached the API.");
});

router.use('/realm', require('./realm/core.js'));

module.exports = router;