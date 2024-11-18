
#Student Platform

This project is a web platform that allows students to sign up, apply for jobs, and submit application forms with videos and cover letters. Recruiters can log in to review applications and rank candidates based on skills and job description relevance.

Table of Contents

	•	Features
	•	Technologies Used
	•	Setup and Installation
	•	Running the Project
	•	Troubleshooting

Features

	•	Student & Recruiter Roles: Separate login and signup functionality for students and recruiters.
	•	Application Form: Students can upload a video, cover letter, and CV, with optional fields for disabilities.
	•	Ranking System: Applications can be ranked by recruiters based on candidate fit for roles.
	•	MongoDB Integration: Application and user data are stored in MongoDB Atlas.

Technologies Used

	•	Frontend: React, Tailwind CSS, React Router
	•	Backend: Node.js, Express, MongoDB
	•	Authentication: JWT (JSON Web Token)
	•	Database: MongoDB Atlas (Mongoose ORM)
	•	File Uploads: multer middleware
	•	Password Hashing: bcryptjs

Setup and Installation

Prerequisites

	•	Node.js (version 18 or above recommended)
	•	MongoDB Atlas Account
	•	Visual Studio Code (or your preferred editor)

Clone Repository

git clone <your-repository-url>
cd student-platform

Environment Variables

Create a .env file in the root directory of the backend folder with the following:

MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
PORT=5001

Install Dependencies

	1.	Backend:

cd backend
npm install


	2.	Frontend:

cd ../frontend
npm install



Initialize Sample Data

After setting up MongoDB and environment variables, insert sample data for testing:

// In server.js, within `startServer`:
await insertSampleData(); // Ensure this line exists to insert data for testing

Running the Project

	1.	Start Backend Server:

cd backend
npm start


	2.	Start Frontend Development Server:

cd ../frontend
npm start



Visit http://localhost:3000 for the frontend and http://localhost:5001 for the backend API.

Troubleshooting

Common Issues

	•	nvm Not Recognized:
Ensure nvm is installed and initialized by adding the following lines to ~/.zshrc or ~/.bashrc:

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"


	•	MongoDB Atlas SSL Error:
Confirm ssl: true, sslValidate: false in mongoose.connect options if SSL issues persist.
	•	bcrypt Password Comparison Issues:
Use bcryptjs consistently for hashing and comparison. Ensure bcrypt is fully uninstalled to avoid conflicts.

License

This project is licensed under the MIT License.
