const { createConnection } = require('mysql2/promise');

let connection = null;

async function connectToDB(host, user, database, password) {
    connection = await createConnection({
        host, user, database, password
    })
    console.log("Connected to MySQL");
}
 function getConnection() {
    return connection;
}

module.exports = {
    connectToDB, getConnection
}