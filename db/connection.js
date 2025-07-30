const oracledb = require('oracledb');

oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT });
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function getConnection() {
  return await oracledb.getConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    connectString: process.env.DB_HOST
  });
}

module.exports = getConnection;
