require('dotenv').config();
const oracledb = require('oracledb');

oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT });
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function run() {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_HOST
    });

    const result = await connection.execute(`
        SELECT * FROM hr_employees
        WHERE ROWNUM <= 3
        `);
    console.log(result.rows);

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) await connection.close();
  }
}

run();
