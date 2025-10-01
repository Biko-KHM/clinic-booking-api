Clinic Booking CRUD API-

A CRUD application built with Node.js (Express) and MySQL for managing Patients, Doctors, and Appointments in a Clinic Booking System. Developed by Bikila Keneni as part of a Week 8 Assignment to demonstrate skills in database design and API development.
Prerequisites

Node.js (v16 or higher)
npm
MySQL Server
MySQL Client
Postman (recommended for testing)

Installation

Clone the repository:

git clone https://github.com/Biko-KHM/clinic-booking-api.git
cd clinic-booking-api


Install dependencies:

npm install


Set up the MySQL database:
Create a MySQL database named clinic_booking.
Run the SQL script db/clinic_booking.sql to create tables and constraints:



mysql -u root -p clinic_booking < db/clinic_booking.sql


Create a .env file in the project root and add your MySQL credentials:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=clinic_booking

Running the Application

Start the Express server:

npm start


Access the API at http://localhost:3000

API Endpoints
Root

GET / - Check if the API is running
Response: {"message": "Clinic Booking API by Bikila Keneni is running!"}



Patients

POST /patients - Create a new patient
Body: {"first_name": "string", "last_name": "string", "email": "string", "phone": "string", "date_of_birth": "YYYY-MM-DD"}
Example: {"first_name": "John", "last_name": "Doe", "email": "john.doe@example.com", "phone": "1234567890", "date_of_birth": "1990-01-01"}


GET /patients - List all patients
GET /patients/:patient_id - Get a specific patient
PUT /patients/:patient_id - Update a patient
Body: Same as POST


DELETE /patients/:patient_id - Delete a patient

Doctors

POST /doctors - Create a new doctor
Body: {"first_name": "string", "last_name": "string", "specialty": "string", "email": "string", "phone": "string"}
Example: {"first_name": "Jane", "last_name": "Smith", "specialty": "Cardiology", "email": "jane@example.com", "phone": "0987654321"}



Appointments

POST /appointments - Create a new appointment
Body: {"patient_id": int, "doctor_id": int, "appointment_date": "YYYY-MM-DD HH:MM:SS", "reason": "string"}
Example: {"patient_id": 1, "doctor_id": 1, "appointment_date": "2025-10-01 10:00:00", "reason": "Checkup"}


GET /appointments - List all appointments
GET /appointments/:appointment_id - Get a specific appointment
PUT /appointments/:appointment_id - Update an appointment
Body: Same as POST


DELETE /appointments/:appointment_id - Delete an appointment

Database

Uses MySQL with the clinic_booking database
Tables: patients, doctors, appointments, medical_records
Relationships:
One-to-Many: Patients to Appointments
One-to-Many: Doctors to Appointments
One-to-One: Appointments to Medical Records


Constraints: Primary keys, foreign keys, unique constraints on email, phone, and doctor appointment times

Testing
Use Postman or curl to test the endpoints. Example using Postman:

POST /doctors:

URL: http://localhost:3000/doctors

Body (JSON):
{
  "first_name": "Jane",
  "last_name": "Smith",
  "specialty": "Cardiology",
  "email": "jane@example.com",
  "phone": "0987654321"
}




POST /patients:

URL: http://localhost:3000/patients

Body (JSON):
{
  "first_name": "Biko",
  "last_name": "Keno",
  "email": "Biko.Keno@example.com",
  "phone": "1234567890",
  "date_of_birth": "1990-01-01"
}




POST /appointments:

URL: http://localhost:3000/appointments

Body (JSON):
{
  "patient_id": 1,
  "doctor_id": 1,
  "appointment_date": "2025-10-01 10:00:00",
  "reason": "Checkup"
}





Example using curl:
curl -X POST http://localhost:3000/patients -H "Content-Type: application/json" -d '{"first_name":"Biko","last_name":"keno","email":"biko.keno@example.com","phone":"1234567890","date_of_birth":"1990-01-01"}'
