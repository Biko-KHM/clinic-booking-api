// Clinic Booking CRUD API by Bikila Keneni
const express = require("express");
const mysql = require("mysql2/promise");
require("dotenv").config(); // Load environment variables
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Root route for testing
app.get("/", (req, res) => {
  res.json({ message: "Clinic Booking API is running!" });
});

// CRUD Operations for Patients
app.post("/patients", async (req, res) => {
  const { first_name, last_name, email, phone, date_of_birth } = req.body;
  if (!first_name || !last_name || !email || !phone || !date_of_birth) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO patients (first_name, last_name, email, phone, date_of_birth) VALUES (?, ?, ?, ?, ?)",
      [first_name, last_name, email, phone, date_of_birth]
    );
    res
      .status(201)
      .json({
        patient_id: result.insertId,
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
      });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email or phone already exists" });
    }
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/patients", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM patients");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/patients/:patient_id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM patients WHERE patient_id = ?",
      [req.params.patient_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/patients/:patient_id", async (req, res) => {
  const { first_name, last_name, email, phone, date_of_birth } = req.body;
  if (!first_name || !last_name || !email || !phone || !date_of_birth) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const [result] = await pool.query(
      "UPDATE patients SET first_name = ?, last_name = ?, email = ?, phone = ?, date_of_birth = ? WHERE patient_id = ?",
      [
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        req.params.patient_id,
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json({
      patient_id: parseInt(req.params.patient_id),
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email or phone already exists" });
    }
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/patients/:patient_id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM patients WHERE patient_id = ?",
      [req.params.patient_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// CRUD Operations for Doctors
app.post("/doctors", async (req, res) => {
  const { first_name, last_name, specialty, email, phone } = req.body;
  if (!first_name || !last_name || !specialty || !email || !phone) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO doctors (first_name, last_name, specialty, email, phone) VALUES (?, ?, ?, ?, ?)",
      [first_name, last_name, specialty, email, phone]
    );
    res
      .status(201)
      .json({
        doctor_id: result.insertId,
        first_name,
        last_name,
        specialty,
        email,
        phone,
      });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email or phone already exists" });
    }
    res.status(500).json({ error: "Database error" });
  }
});

// CRUD Operations for Appointments
app.post("/appointments", async (req, res) => {
  const { patient_id, doctor_id, appointment_date, reason } = req.body;
  if (!patient_id || !doctor_id || !appointment_date || !reason) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const [patient] = await pool.query(
      "SELECT * FROM patients WHERE patient_id = ?",
      [patient_id]
    );
    if (patient.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const [doctor] = await pool.query(
      "SELECT * FROM doctors WHERE doctor_id = ?",
      [doctor_id]
    );
    if (doctor.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    const [result] = await pool.query(
      "INSERT INTO appointments (patient_id, doctor_id, appointment_date, reason, status) VALUES (?, ?, ?, ?, ?)",
      [patient_id, doctor_id, appointment_date, reason, "Scheduled"]
    );
    res
      .status(201)
      .json({
        appointment_id: result.insertId,
        patient_id,
        doctor_id,
        appointment_date,
        reason,
        status: "Scheduled",
      });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ error: "Doctor has a conflicting appointment" });
    }
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/appointments", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM appointments");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/appointments/:appointment_id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM appointments WHERE appointment_id = ?",
      [req.params.appointment_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/appointments/:appointment_id", async (req, res) => {
  const { patient_id, doctor_id, appointment_date, reason } = req.body;
  if (!patient_id || !doctor_id || !appointment_date || !reason) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const [patient] = await pool.query(
      "SELECT * FROM patients WHERE patient_id = ?",
      [patient_id]
    );
    if (patient.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const [doctor] = await pool.query(
      "SELECT * FROM doctors WHERE doctor_id = ?",
      [doctor_id]
    );
    if (doctor.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    const [result] = await pool.query(
      "UPDATE appointments SET patient_id = ?, doctor_id = ?, appointment_date = ?, reason = ? WHERE appointment_id = ?",
      [
        patient_id,
        doctor_id,
        appointment_date,
        reason,
        req.params.appointment_id,
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json({
      appointment_id: parseInt(req.params.appointment_id),
      patient_id,
      doctor_id,
      appointment_date,
      reason,
      status: "Scheduled",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ error: "Doctor has a conflicting appointment" });
    }
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/appointments/:appointment_id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM appointments WHERE appointment_id = ?",
      [req.params.appointment_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
