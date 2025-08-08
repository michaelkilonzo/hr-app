const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");

// GET employees
router.get("/employees", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_HOST,
    });

    const result = await connection.execute(
      `SELECT employee_id, first_name, last_name, email, phone_number FROM HR_EMPLOYEES`
    );

    res.json(
      result.rows.map(row => ({
        employeeId: row[0],
        firstName: row[1],
        lastName: row[2],
        email: row[3],
        phoneNumber: row[4],
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employees" });
  } finally {
    if (connection) await connection.close();
  }
});

// PUT update employees (email, phone only)
router.put("/employees", async (req, res) => {
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
          phone_number = :phone
      WHERE employee_id = :id
    `;

    for (const emp of updates) {
      await connection.execute(updateSQL, {
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
