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
cd backend
npm install
npm run start

✏️ Create a .env file inside backend/ with the following content:

PORT=5001
MONGODB_URI='your_mongodb_uri'
JWT_SECRET='your_jwt_secret'
NODE_ENV=development

🎨 Frontend Setup

cd ../frontend
npm install
npm run dev

## Sample Screenshots

<img width="1343" height="648" alt="Image" src="https://github.com/user-attachments/assets/ff03d50a-bef6-4548-a35d-b19b8bcae016" />

<img width="1343" height="545" alt="Image" src="https://github.com/user-attachments/assets/b00ce573-9ca2-4e02-81d8-0e5b069a6687" />

<img width="1341" height="644" alt="Image" src="https://github.com/user-attachments/assets/3bf2bc31-25ee-4017-9fb4-5c307bed1144" />

<img width="1347" height="412" alt="Image" src="https://github.com/user-attachments/assets/0c769c40-8729-45c8-8681-f99aeac974e2" />

<img width="1340" height="635" alt="Image" src="https://github.com/user-attachments/assets/31dd696b-2714-41ab-982c-55c7a87881c5" />

