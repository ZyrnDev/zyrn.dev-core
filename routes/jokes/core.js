const express   = require('express');
const router    = express.Router();

router.get('/pawi', function (req, res) {
    res.render("jokes/pawi", { page: { title: "Pawi" } });
});

module.exports = router;