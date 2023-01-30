const sql = require("mssql");

const DBConnection = {
  // setup connection
  connection: null,
  init: async function () {
    try {
      if (!this.connection) {
        const conn_pool = new sql.ConnectionPool({
          user: process.env.AZURE_USER,
          password: process.env.AZURE_PASSWORD,
          server: process.env.AZURE_SERVER,
          database: process.env.AZURE_DB,
          connectionTimeout: parseInt(process.env.AZURE_SQL_CONNECTION_TIMEOUT),
          requestTimeout: parseInt(process.env.AZURE_SQL_REQUEST_TIMEOUT),
          pool: {
            min: parseInt(process.env.AZURE_SQL_POOL_MIN),
            max: parseInt(process.env.AZURE_SQL_POOL_MAX),
          },
        });
        this.connection = await conn_pool.connect();
      }
    } catch (error) {
      console.log(error);
    }
  },
};

async function sql_request_instance() {
  await DBConnection.init();
  const queryRequest = new sql.Request(DBConnection.connection);
  return queryRequest;
}

async function executeQuery(queryStr) {
  const queryRequest = await sql_request_instance();
  const queryResponse = await queryRequest.query(queryStr);
  return queryResponse;
}

module.exports = {
  DBConnection,
  executeQuery,
  sql_request_instance,
};
