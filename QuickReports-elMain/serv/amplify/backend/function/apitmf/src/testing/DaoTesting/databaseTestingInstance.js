// database connection
// source - https://mhagemann.medium.com/create-a-mysql-database-middleware-with-node-js-8-and-async-await-6984a09d49f4
const util = require('util');
const dbConfig = require('./databaseTestingConfig.json');
const mysql = require('serverless-mysql')({
    config:{
        connectionLimit: 10,
        host: dbConfig.dbHost,
        user: dbConfig.dbUser,
        password: dbConfig.dbPassword,
        port: 3306,
        database: dbConfig.dbName
    }
    
});

// run query w promise
const runQuery = async (q, vals) => {
    return await mysql.query(q , vals);    
};

// promisify for async/await
mysql.query = util.promisify(mysql.query).bind(mysql)

module.exports = { mysql, runQuery}