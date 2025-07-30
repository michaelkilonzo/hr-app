require('dotenv').config();

const express = require('express');
const path = require('path');
const oracledb = require('oracledb');

const app = express();
const PORT = 3000;

oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT });
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve HTML

// POST /api/employees/hire
app.post('/api/employees/hire', async (req, res) => {
  const {
    first_name, last_name, email, salary, phone,
    job_id, manager_id, department_id
  } = req.body;

  let connection;

  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_HOST
    });

    await connection.execute(
      `BEGIN
         employee_hire_sp(:first_name, :last_name, :email, :salary, SYSDATE, :phone, :job_id, :manager_id, :department_id);
       END;`,
      { first_name, last_name, email, salary, phone, job_id, manager_id, department_id }
    );

    res.status(200).json({ message: 'Employee hired successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to hire employee', details: err.message });
  } finally {
    if (connection) await connection.close();
  }
});



app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));


