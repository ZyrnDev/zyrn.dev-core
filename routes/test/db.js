const express   = require('express');
const router    = express.Router();
const database  = global.database;

router.get('/', async (req, res) => {
    try {
        res.json(await database.getTest());
    } catch (err) {
        res.send(JSON.stringify({error: 500, reason: "Database connection failed."}));
    }
});

router.post('/', async (req, res, next) => {
    if (req.body.column2 == undefined) {
        next();
        return;
    }

    let response = {
        status: 500,
        insertID: -1
    };

    try {
        let result = await database.addTest(req.body.column2);

        if ( result.insertId != -1 ) {
            response = {
                status: 200,
                insertID: result.insertId,
            };
        } else {
            console.log("Failed to add 'test' with 'column2' = '" + req.body.column2 + "'.");            
        }
        
        
        
    } catch (err) {
        console.log("Failed to add 'test' with 'column2' = '" + req.body.column2 + "'.");
        console.log(err);
    }
    
    res.json(response);
});

module.exports = router;