-- Clinic Booking Database Schema by Bikila Keneni
   -- Creating the database
   CREATE DATABASE clinic_booking;
   USE clinic_booking;

   -- Creating Patients table
   CREATE TABLE patients (
       patient_id INT AUTO_INCREMENT PRIMARY KEY,
       first_name VARCHAR(50) NOT NULL,
       last_name VARCHAR(50) NOT NULL,
       email VARCHAR(100) UNIQUE NOT NULL,
       phone VARCHAR(20) UNIQUE NOT NULL,
       date_of_birth DATE NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Creating Doctors table
   CREATE TABLE doctors (
       doctor_id INT AUTO_INCREMENT PRIMARY KEY,
       first_name VARCHAR(50) NOT NULL,
       last_name VARCHAR(50) NOT NULL,
       specialty VARCHAR(100) NOT NULL,
       email VARCHAR(100) UNIQUE NOT NULL,
       phone VARCHAR(20) UNIQUE NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Creating Appointments table
   CREATE TABLE appointments (
       appointment_id INT AUTO_INCREMENT PRIMARY KEY,
       patient_id INT NOT NULL,
       doctor_id INT NOT NULL,
       appointment_date DATETIME NOT NULL,
       status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
       reason TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
       FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
       UNIQUE (doctor_id, appointment_date)
   );

   -- Creating Medical Records table (One-to-One with Appointments)
   CREATE TABLE medical_records (
       record_id INT AUTO_INCREMENT PRIMARY KEY,
       appointment_id INT NOT NULL,
       diagnosis TEXT,
       prescription TEXT,
       notes TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE CASCADE,
       UNIQUE (appointment_id)
   );