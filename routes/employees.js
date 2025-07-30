const express = require('express');
const router = express.Router();
const getConnection = require('../db/connection');

router.post('/hire', async (req, res) => {
  const {
    first_name, last_name, email, salary, phone,
    job_id, manager_id, department_id
  } = req.body;

  let connection;

  try {
    connection = await getConnection();

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

module.exports = router;
