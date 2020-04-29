const express   = require('express');
const router    = express.Router();

router.get('/', function (req, res) {
    res.redirect("/realm/accounts");
});

router.get('/accounts', function (req, res) {
    res.render("realm/index", { page: { title: "Realm Mules" } });
});

router.get('/accounts/:id', async function (req, res, next) {
    let account = await getAccount(req.params.id);
    if (!account) {
        return next();
    }
    res.render("realm/edit", { page: { title: "Manage Account " }, account: account });
});

async function getAccount(id) {
    let accounts = await global.database.realm.getAccountsByID(id);
    if (accounts === undefined) {
        return undefined;
    }
    if (accounts.length < 1) {
        return undefined;
    }
    return(accounts[0]);
}

module.exports = router;