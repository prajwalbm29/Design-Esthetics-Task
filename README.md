# Design Esthetics Task

This is a full-stack web application built as part of a task for **Design Esthetics**. It includes user authentication, password reset via email OTP, and role-based access control. Admins have extended capabilities such as managing users.

---

## 🚀 Live Demo

👉 [Visit the Live App](https://design-esthetics-task-client.onrender.com/)

---

## ✨ Features

### 🔐 User
- Register with email and password
- Login with credentials
- Reset password via email OTP
- Role-based access (User/Admin)

### 🛠️ Admin
- Create new users
- Update existing users
- Delete users

---

## 🧪 Technologies Used

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, Email OTP
- **Deployment:** Render.com

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/prajwalbm29/Design-Esthetics-Task.git
cd Design-Esthetics-Task
2. Install Dependencies
Frontend:

bash
Copy
Edit
cd client
npm install
Backend:

bash
Copy
Edit
cd ../server
npm install
3. Set Up Environment Variables
Create a .env file inside the server directory and add the following:

env
Copy
Edit
PORT=8080
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
4. Run the Application
Start Backend:

bash
Copy
Edit
cd server
npm run dev   # or npm start
Start Frontend:

bash
Copy
Edit
cd client
npm run dev
🧑‍💻 Admin Test Credentials
Use the following credentials to log in as an admin:

Email: bmprajwal43@gmail.com

Password: 123456

📄 License
This project is for evaluation purposes only.

🙌 Acknowledgements
Thanks to Design Esthetics for the opportunity!
