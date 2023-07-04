// database connection
// source - https://mhagemann.medium.com/create-a-mysql-database-middleware-with-node-js-8-and-async-await-6984a09d49f4
const util = require('util');
const dbConfig = require('./databaseConfig.json');
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



// // check for errors in DB server
// mysql.getClient((err, connection)=>{
//     if (err){
//         if (err.code === 'PROTOCOL_CONNECTION_LOST'){
//             console.error('Database connection was closed.')
//         }
//         if (err.code === 'ER_CON_COUNT_ERROR'){
//             console.error('Database has too many connections')
//         }
//         if (err.code === 'ECONNREFUSED'){
//             console.error('Database connection was refused.')
//         }
//     }
//     if (connection) connection.release()

//     return
// });

// run query w promise
const runQuery = async (q, vals) => {
    //q = mysql.format(q, vals);
    return await mysql.query(q , vals);    
};


// promisify for async/await
mysql.query = util.promisify(mysql.query).bind(mysql)

module.exports = { mysql, runQuery}