// /**
//  * Project Name: Bug Analyzer
//  * @Project Bug Analyzer
//  * @author Yash Pathak
//  * @date Jan 19, 2024
//  * 
//  * Module: Database
//  * Description
//  * ----------------------------------------------------------------------------------- 
//  * Contains the function for DB Connection
//  * 
//  * -----------------------------------------------------------------------------------
//  * 
//  * Revision History
//  * -----------------------------------------------------------------------------------
//  * Modified By          Modified On         Description
//  * Yash Pathak          Jan 19, 2024        Initially Created
//  * -----------------------------------------------------------------------------------
//  */

// let { Client } = require("pg");
// require('dotenv').config();
// /**
//  * Represents the PostgreSQL client for database connection.
//  * @type {Client}
//  */
// let client = new Client({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     port: process.env.DB_PORT,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
// });

// /**
//  * Connects to the PostgreSQL database.
//  * @param {Error} err - The error object if any occurs during the connection.
//  */
// client.connect((err) => {
//     if (err) throw err;
//     logger.info(global.messages.DATABASE_CONNECTED);
// });

// /**
//  * Exporting the configured PostgreSQL client for database connection.
//  * @type {Client}
//  */
// module.exports = client;

/**
 * Project Name: Bug Analyzer
 * @Project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 19, 2024
 * 
 * Module: Database
 * Description
 * ----------------------------------------------------------------------------------- 
 * Contains the function for DB Connection
 * 
 * -----------------------------------------------------------------------------------
 * 
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By          Modified On         Description
 * Yash Pathak          Jan 19, 2024        Initially Created.
 * Yash Pathak          Feb 12, 2024        Updated connection method from client to pool.
 * -----------------------------------------------------------------------------------
 */

let { Pool } = require("pg");
require('dotenv').config();


/**
 * Represents the PostgreSQL pool for database connection.
 * @type {Pool}
 */
let pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    max: 100, // Adjust the number of connections in the pool as needed
    idleTimeoutMillis: 30000, // Adjust the timeout for idle connections as needed
    connectionTimeoutMillis: 2000, // Adjust the timeout for establishing a new connection as needed
});

/**
 * Connects to the PostgreSQL database.
 * @param {Error} err - The error object if any occurs during the connection.
 * @param {Client} client - The PostgreSQL client object representing the connection.
 * @param {function} release - A function to release the acquired connection back to the pool.
 * 
 */

pool.connect((err, client, release) => {
    if (err) {
        logger.error( err);
        return;
    }

    // Successfully connected to the database
    release();
    logger.info(global.messages.DATABASE_CONNECTED);
});

/**
 * Exporting the configured PostgreSQL pool for database connection.
 * @type {Pool}
 */
module.exports = pool;