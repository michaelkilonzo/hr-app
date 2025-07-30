require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const employeeRoutes = require('./routes/employees');
app.use('/api/employees', employeeRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
