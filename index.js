require('dotenv').config();
const oracledb = require('oracledb');

oracledb.initOracleClient({ libDir: "/Users/michaelkilonzo/Downloads/instantclient_23_3" });
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function run() {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=oracle.cs.torontomu.ca)(PORT=1521))(CONNECT_DATA=(SID=orcl)))`
    });

    const result = await connection.execute(`SELECT * FROM hr_employees`);
    console.log(result.rows);

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) await connection.close();
  }
}

run();
