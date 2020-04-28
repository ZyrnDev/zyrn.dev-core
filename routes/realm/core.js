const express   = require('express');
const router    = express.Router();

router.get('/', function (req, res) {
    res.redirect("accounts");
});

router.get('/accounts', function (req, res) {
    res.render("realm/index", { page: { title: "Realm Mules" } });
});

router.get('/accounts/:id', function (req, res) {
    res.render("realm/edit", { page: { title: "Account " + req.params.id } });
});

module.exports = router;