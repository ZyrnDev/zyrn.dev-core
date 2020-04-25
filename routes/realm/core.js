const express   = require('express');
const router    = express.Router();

router.get('/', function (req, res) {
    res.send("You reached the realm site.");
});

module.exports = router;