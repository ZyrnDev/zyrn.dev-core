const express   = require('express');
const router    = express.Router();

router.get('/pawi', function (req, res) {
    res.render('templates/centered', { page: { title: "Pawi" }, content: { body: 'jokes/pawi' } });
});
router.get('/flower', function (req, res) {
    res.render('templates/centered', { page: { title: "Sam's Flower" }, content: { body: 'jokes/flower' } });
});

module.exports = router;