const express   = require('express');
const request   = require("request");
const xml2js    = require('xml2js');
const parser    = new xml2js.Parser();
const router    = express.Router();
const database = global.database.realm;

router.get('/recent', async (req, res) => {
    res.json(await database.getRecentRefresh());
})

router.get('/', async (req, res) => {
    let accounts = await database.getAccounts();
    let threadsRemaining = accounts.length;
    res.send("Refresh started.");
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].active == 0) {
            accounts.splice(i,1);
            i--;
        }
        // console.log(accounts[i]);
    }
    for (let i = 0; i < accounts.length; i++) {
        //console.log("index: " + i);
        requestAccount(accounts[i]);
        await sleep(1000 * 30);
    }
});

// router.get('/:id', async (req, res) => {
//     var results = [];

//     let accounts = await database.getAccountsByID(req.params.id);
//     let account;
//     if (accounts.length < 1) {
//         account = undefined;
//     } else {
//         account = accounts[0];
//     }

//     if (account === undefined) {
//         res.json(results);
//         return;
//     }

//     async function realm_API_callback(error, response, body) {
//         //console.log(response, body)
//         if (response.statusCode == 200) {
//             parser.parseString(body, function (err, result) {
//                 //console.log(result);
//                 try { 
//                     results.push({accountID: response.request.headers.ID, status: 'Success', guid: response.request.headers.GUID, message: result.Chars.Account[0].Name[0], time: new Date().toISOString()});
//                 } catch(err) {
//                     //console.log(error);
//                     results.push({accountID: response.request.headers.ID, status: 'Fail', guid: response.request.headers.GUID, message: body, time: new Date().toISOString()});
//                 }
//             });
//         } else {
//             results.push({accountID: response.request.headers.ID, status: ('Fail: ' + response.statusCode), guid: response.request.headers.GUID, message: body, time: new Date().toISOString()});
//         }

//         res.json(results);
//         for (let index = 0; index < results.length; index++) {
//             await database.addRefresh({id: results[index].accountID, status: results[index].status, message: results[index].message});
//         }
//     }

//     request(makeParams(account), realm_API_callback);
// });

function makeURL(account) {
    if (account.guid.startsWith('steamworks:')) {
        return 'https://www.realmofthemadgod.com/char/list?muleDump=true&__source=jakcodex-v964&guid=' + encodeURIComponent(account.guid) + '&secret=' + encodeURIComponent(account.password);
    } else {
        return 'https://www.realmofthemadgod.com/char/list?muleDump=true&__source=jakcodex-v964&guid=' + encodeURIComponent(account.guid) + '&password=' + encodeURIComponent(account.password);
    }
}

function makeParams(account) {
    return { 
        method: 'GET', 
        uri: makeURL(account), 
        headers: {
            'ID': account.id,
            'GUID': account.guid
            //,'Password': account.password
        }
    };
}

async function requestAccount(account) {
    var results = undefined;
    async function realm_API_callback(error, response, body) {
        if (response.statusCode == 200) {
            parser.parseString(body, function (err, result) {
                //console.log(result);
                try { 
                    results = {accountID: response.request.headers.ID, status: 'Success', guid: response.request.headers.GUID, name: result.Chars.Account[0].Name[0]};
                } catch(err) {
                    //console.log(error);
                    results = {accountID: response.request.headers.ID, status: 'Fail', guid: response.request.headers.GUID, name: body};
                }      

            });
        } else {
            results = {accountID: response.request.headers.ID, status: ('Fail: ' + response.statusCode), guid: response.request.headers.GUID, name: body};
        }

        await database.addRefresh({id: results.accountID, status: results.status, message: results.name});
    }

    request(makeParams(account), realm_API_callback);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = router;