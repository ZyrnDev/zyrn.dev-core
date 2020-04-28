const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit : 100,
    host : global.config.database.host,
    database : global.config.database.schema,
    user : global.config.database.username,
    password : global.config.database.password,
    port : global.config.database.port,
    debug : false
});

function getAccounts() {
    return new Promise(function(resolve, reject) {
        let baseQuery = "SELECT ID as ?, GUID as ?, password as ?, active as ? FROM accounts"
        let query = mysql.format(baseQuery, ["id", "guid", "password", "active"]);

        pool.query(query, (err, data) => {
            if(err) {
                console.error(err);
                reject(err);
                return;
            }
            // rows added
            resolve(data);
        });
    });
}

function getAccountsByID(id) {
    return new Promise(function(resolve, reject) {
        let baseQuery = "SELECT ID as ?, GUID as ?, password as ?, active as ? FROM accounts WHERE ID = ?"
        let query = mysql.format(baseQuery, ["id", "guid", "password", "active", id]);

        pool.query(query, (err, data) => {
            if(err) {
                console.error(err);
                reject(err);
                return;
            }
            // rows added
            resolve(data);
        });
    });
}

function addAccount(account) {
    return new Promise(function(resolve, reject) {
        let insertQuery = 'INSERT INTO accounts (GUID, password) VALUES (?,?)'

        let query = mysql.format(insertQuery, [account.guid, account.password]);

        pool.query(query,(err, response) => {
            if(err) {
                console.error(err);
                reject(err);
                return;
            }
            // rows added
            resolve(response.insertId);
        });
    });
}

function updateAccount(account) {
    return new Promise(function(resolve, reject) {
    	let query;
        if (account.password === undefined) {
            let insertQuery = 'UPDATE accounts SET GUID = ? WHERE ID = ?'
            query = mysql.format(insertQuery, [account.guid, account.id]);
        } else {
            let insertQuery = 'UPDATE accounts SET GUID = ?, password = ? WHERE ID = ?'
            query = mysql.format(insertQuery, [account.guid, account.password, account.id]);
        }
        
        pool.query(query,(err, response) => {
            if(err) {
                console.error(err);
                reject(err);
                return;
            }
            // rows added
            resolve(response.insertId);
        });
    });
}

function updateAccount_NoPassword(account) {
    return new Promise(function(resolve, reject) {
        let insertQuery = 'UPDATE accounts SET GUID = ? WHERE ID = ?'

        let query = mysql.format(insertQuery, [account.guid, account.id]);

        pool.query(query,(err, response) => {
            if(err) {
                console.error(err);
                reject(err);
                return;
            }
            // rows added
            resolve(response.insertId);
        });
    });
}

function deleteAccount(id) {
    return new Promise(function(resolve, reject) {
        let baseQuery = 'DELETE FROM accounts WHERE ID = ?'
        let query = mysql.format(baseQuery, [id]);

        pool.query(query,(err, response) => {
            if(err) {
                console.error(err);
                reject(err);
                return;
            }
            // rows added
            resolve(response);
        });
    });
}

function addRefresh(refresh) {
    return new Promise(function(resolve, reject) {
        let insertQuery = 'INSERT INTO refreshs (time, accountID, status, message) VALUES (NOW(), ?, ?, ?)'

        let query = mysql.format(insertQuery, [refresh.id, refresh.status, refresh.message]);

        pool.query(query,(err, response) => {
            if(err) {
                console.error(err);
                reject(err);
                return;
            }
            // rows added
            resolve(response.insertId);
        });
    });
}

function getRecentRefresh() {
    return new Promise(function(resolve, reject) {
    	let columns = "refreshs.ID as 'refreshID', accounts.ID as 'accountID', GUID as 'guid', status, time, message"
        let selectQuery = 'SELECT ' + columns + ' FROM refreshs INNER JOIN accounts ON accounts.ID = refreshs.accountID WHERE refreshs.ID in ( SELECT MAX(r.ID) FROM refreshs AS r GROUP BY r.accountID) AND accounts.active = 1 ORDER BY status, accountID'
        let query = mysql.format(selectQuery);

        pool.query(query,(err, response) => {
            if(err) {
                console.error(err);
                reject(err);
                return;
            }
            // rows added
            resolve(response);
        });
    });
}

let realm = {
    getAccounts:                getAccounts,
    getAccountsByID:            getAccountsByID,
    addAccount:                 addAccount,
    updateAccount:              updateAccount,
    updateAccount_NoPassword:   updateAccount_NoPassword,
    deleteAccount:              deleteAccount,
    addRefresh:                 addRefresh,
    getRecentRefresh:           getRecentRefresh,
}

module.exports = {
    connection: pool,
    realm: realm,
}