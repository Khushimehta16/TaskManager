# Team Task Manager

A comprehensive, full-stack project management application built with the MERN stack. This application features role-based access control, task tracking, and a modern, glassmorphic UI.

## 🚀 Features

- **Role-Based Authentication**: Secure login and signup for both Admins and Members.
- **Admin Dashboard**: Create and manage projects, assign tasks to team members, and track overall progress.
- **Member Dashboard**: View assigned tasks, update task status, and track personal productivity.
- **Modern UI/UX**: Stunning glassmorphism design with responsive layouts and smooth transitions.
- **Real-time Updates**: Integrated with a robust backend to ensure data consistency across the platform.

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **CSS** (Custom Styling / Glassmorphism)
- **React Router** (Navigation)
- **Axios** (API Requests)
- **Lucide React** (Icons)

### Backend
- **Node.js** & **Express**
- **MongoDB** (Database)
- **JWT** (JSON Web Tokens for Authentication)
- **Bcrypt.js** (Password Hashing)

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Khushimehta16/TaskManager.git
cd TaskManager
```

### 2. Backend Setup
```bash
cd server
npm install
# Create a .env file and add your MONGO_URI and JWT_SECRET
npm start
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 📝 License
This project is licensed under the MIT License.
