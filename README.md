# 🥗 Calorie Tracker App

A full-stack Calorie Tracker built with **React**, **Redux Toolkit**, **Express.js**, and **MongoDB Atlas**. It helps users manage their calorie intake effectively with features like TDEE calculation, date-wise tracking, profile management, and more.

---

## 🚀 Live Demo

> Coming Soon!

---

## ✨ Features

- ✅ **User Authentication**: Signup, login, and logout with secure JWT-based sessions.
- 👤 **Profile Management**: View and edit profile details or delete your account.
- 📅 **Date-wise Calorie Tracking**: Easily track your calories day-by-day.
- ➕ **Add Entry**: Log food items with calorie details.
- 📝 **Update Entry**: Modify existing food item entries.
- ❌ **Delete Entry**: Remove incorrect or unwanted food entries.
- 📊 **TDEE Calculator**: Automatically calculate Total Daily Energy Expenditure based on user data.
- 📜 **History View**: Check previous entries date-wise for calorie monitoring.
- 🌐 **MongoDB Atlas**: All data is securely stored in the cloud.
- ⚛️ **Redux Toolkit**: Efficient and scalable state management.
- 🌍 **REST API**: Built with Express.js for robust backend performance.

---

## 🛠️ Tech Stack

| Frontend       | Backend        | Database         |   Other Tools       |
|----------------|----------------|------------------|---------------------|
| React.js       | Express.js     | MongoDB Atlas    | Redux Toolkit       |
| Tailwind CSS   | Node.js        | Mongoose         | JWT Authentication  |
| Axios          |                |                  | dotenv, bcryptjs    |

---

## 📦 Project Setup

### 💻 Whole Project Setup

```bash
git clone --single-branch --branch deployment https://github.com/Stack-Explorer/Calorie-Tracker.git
cd Calorie-Tracker

## Backend Setup

```bash
cd backend
npm install
npm run start

## Frontend Setup

```bash
cd ../frontend
npm install
npm run dev

```bash
PORT=5001
MONGODB_URI='your_mongodb_uri'
JWT_SECRET='your_jwt_secret'
NODE_ENV=development

