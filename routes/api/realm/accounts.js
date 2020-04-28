const express   = require('express');
const router    = express.Router();
const database  = global.database.realm;

async function getAccount(id) {
    let accounts = await database.getAccountsByID(id);
    if (accounts === undefined) {
        return undefined;
    }
    if (accounts.length < 1) {
        return undefined;
    }
    return(accounts[0]);
}

/* GET users listing. */
router.get('/', async (req, res) => {
    let accounts = await database.getAccounts();
    for (let i = 0; i < accounts.length; i++) {
        accounts[i] = {id: accounts[i].id, guid: accounts[i].guid};
    }
    res.json(accounts);
});

router.get('/:id', async (req, res) => {
    let account = await getAccount(req.params.id);
    if (account === undefined) {
        res.json([]);
        return;
    }

    res.json([{id: account.id, guid: account.guid}]);
});

router.put('/', async (req, res) => {
	if (req.body.password == '') {
      	await database.updateAccount_NoPassword({id: req.body.id, guid: req.body.guid});
  	} else{
      	await database.updateAccount({id: req.body.id, guid: req.body.guid, password: req.body.password});
  	}

    let account = await getAccount(req.body.id);
    if (!account) { res.json([]); return; }
    res.json([account]);
});

router.post('/', async (req, res) => {
    let id = await database.addAccount({id: req.body.id, guid: req.body.guid, password: req.body.guid});
    if (id === undefined) { res.json([]); return; }
    let account = await getAccount(id);
    if (account === undefined) { res.json([]); return; }
    res.json([account])
    // res.json(req.body);
});

router.delete('/:id', async (req, res) => {
    res.json(await database.deleteAccount(req.params.id));
});



module.exports = router;