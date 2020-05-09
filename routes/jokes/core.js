const express   = require('express');
const router    = express.Router();

router.get('/pawi', function (req, res) {
    res.render('templates/centered', { page: { title: "Pawi" }, content: { body: 'jokes/pawi' } });
});

module.exports = router;