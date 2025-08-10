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
      `SELECT employee_id, first_name, last_name, email, phone_number, salary FROM HR_EMPLOYEES`
    );

    res.json(
      result.rows.map(row => ({
        employeeId: row.EMPLOYEE_ID,
        firstName: row.FIRST_NAME,
        lastName: row.LAST_NAME,
        email: row.EMAIL,
        phoneNumber: row.PHONE_NUMBER,
        salary: row.SALARY
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
  const updates = req.body.updates;
  if (!updates || !Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ error: "No updates provided" });
  }

  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_HOST,
    });

    const updateSQL = `
      UPDATE HR_EMPLOYEES
      SET email = :email,
          phone_number = :phone,
          salary = :salary
      WHERE employee_id = :id
    `;

    for (const emp of updates) {
      console.log("Updates received:", updates);
      await connection.execute(updateSQL, {
        salary: emp.salary,
        email: emp.email, 
        phone: emp.phoneNumber,
        id: emp.employeeId,
      });
    }

    await connection.commit();
    res.json({ message: "Employees updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update employees" });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;
