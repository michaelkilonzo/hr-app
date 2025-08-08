require('dotenv').config();
const express = require('express');
const path = require('path');
const oracledb = require('oracledb');

const app = express();
const PORT = 3000;

// Oracle client init
try {
  oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT });
  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
} catch (err) {
  console.error('Oracle Client init failed:', err);
  process.exit(1);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.get('/', (req, res) => {
  console.log('Serving app.html');
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

const hireRoute = require('./routes/hire');
app.use('/api/employees', hireRoute);
app.use("/update", require("./routes/update"));
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
