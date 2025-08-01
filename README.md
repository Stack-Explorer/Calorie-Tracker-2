## Sample Screenshots 

<img width="1374" height="929" alt="Login Header" src="https://github.com/user-attachments/assets/747bbae1-11e4-4a5b-bb64-d6624465d787" />
--- Login Header
<img width="1222" height="702" alt="SIgnup" src="https://github.com/user-attachments/assets/5329e95c-dd47-4128-9f73-fa710521426a" />
--- Signup
<img width="1902" height="899" alt="Home Page" src="https://github.com/user-attachments/assets/2453c745-a0b2-41b0-9072-b203cafa2142" />
--- HomePage
<img width="1324" height="851" alt="Calorie-History Page" src="https://github.com/user-attachments/assets/e201b1ba-05ec-475a-969f-88ba7c0b4347" />
--- Calorie Intake Data With charts and xlsx download support
<img width="1252" height="440" alt="DateWIse Calorie Burnt" src="https://github.com/user-attachments/assets/20f1e697-7c2c-4d35-81ba-122afe46de87" />
--- Calorie Burnt Data
<img width="1365" height="605" alt="Edit Profile" src="https://github.com/user-attachments/assets/71eccd2e-a90e-47f7-b4c5-cdccc3bd71c8" />
--- Edit profile page
<img width="1354" height="796" alt="Delete Account" src="https://github.com/user-attachments/assets/eafab6a2-4280-4eb8-a99e-37e33ae377a4" />
--- Delete Account Page
<img width="1274" height="163" alt="Logout Confirmation" src="https://github.com/user-attachments/assets/5d6728a9-59e9-42d4-8989-0d3a3604ffd9" />
--- Logout Confirmation for better UX


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
git clone https://github.com/Stack-Explorer/Calorie-Tracker.git
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
