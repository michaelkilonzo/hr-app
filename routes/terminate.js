// routes/update.js

const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");

// GET all employees
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_HOST,
    });

    const result = await connection.execute(
      `SELECT employee_id, first_name, last_name, phone_number, email, department_name from hr_employees h
        join hr_departments d
        on h.department_id = d.department_id
        order by employee_id`
    );

    res.json(
      result.rows.map(row => ({
        employeeId: row.EMPLOYEE_ID,
        firstName: row.FIRST_NAME,
        lastName: row.LAST_NAME,
        email: row.EMAIL,
        phoneNumber: row.PHONE_NUMBER,
        deptName: row.DEPARTMENT_NAME
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employees" });
  } finally {
    if (connection) await connection.close();
  }
});

router.put("/", async (req, res) => {
  let connection;
  const terminates = req.body.terminate;
  if (!terminates || !Array.isArray(terminates) || terminates.length === 0) {
    return res.status(400).json({ error: "No terminates provided" });
  }

  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_HOST,
    });

    const terminateSQL = `
      DELETE FROM HR_EMPLOYEES
      WHERE employee_id = :id
    `;

    for (const emp of terminates) {
      console.log("Terminates received:", terminates);
      await connection.execute(terminateSQL, {
        id: emp.employeeId,
      });
    }

    await connection.commit();
    res.json({ message: "Employees terminated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to terminate employees" });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;
