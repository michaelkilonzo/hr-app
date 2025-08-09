const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');

// GET /api/employees/jobs
router.get('/jobs', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_HOST,
    });

    const result = await connection.execute(`SELECT job_id, job_title FROM hr_jobs`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  } finally {
    if (connection) await connection.close();
  }
});

// GET /api/employees/managers
router.get('/managers', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_HOST,
    });

    const result = await connection.execute(`
      SELECT employee_id, first_name || ' ' || last_name AS name 
      FROM hr_employees 
      WHERE employee_id IN (
        SELECT DISTINCT manager_id FROM hr_employees WHERE manager_id IS NOT NULL
      )
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch managers' });
  } finally {
    if (connection) await connection.close();
  }
});

// GET /api/employees/departments
router.get('/departments', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_HOST,
    });

    const result = await connection.execute(`SELECT department_id, department_name FROM hr_departments`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch departments' });
  } finally {
    if (connection) await connection.close();
  }
});

// POST /api/employees/hire
router.post('/', async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    salary,
    phone,
    job_id,
    manager_id,
    department_id,
  } = req.body;

  if (!first_name || !last_name || !email || !salary || !job_id || !department_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let connection;

  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_HOST,
    });

    await connection.execute(
      `BEGIN
         employee_hire_sp(:first_name, :last_name, :email, :salary, SYSDATE, :phone, :job_id, :manager_id, :department_id);
       END;`,
      {
        first_name: { val: first_name, type: oracledb.STRING },
        last_name: { val: last_name, type: oracledb.STRING },
        email: { val: email, type: oracledb.STRING },
        salary: { val: salary, type: oracledb.NUMBER },
        phone: { val: phone, type: oracledb.STRING },
        job_id: { val: job_id, type: oracledb.STRING },
        manager_id: manager_id ? { val: manager_id, type: oracledb.NUMBER } : { val: null, type: oracledb.NUMBER },
        department_id: { val: department_id, type: oracledb.NUMBER },
      }
    );

    res.status(200).json({ message: 'Employee hired successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to hire employee', details: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;
