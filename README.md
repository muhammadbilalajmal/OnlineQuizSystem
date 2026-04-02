# ⚡ OnlineQuizSystem — Cloud-Based Online Quiz System

> **BS Software Engineering — 8th Semester | Cloud Computing Semester Project**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Cloud Services](#-cloud-services)
- [Project Structure](#-project-structure)
- [Firebase Setup](#-firebase-setup)
- [Running Locally](#-running-locally)
- [Deployment](#-deployment-netlify--github)
- [Firestore Database Schema](#-firestore-database-schema)
- [Group Members](#-group-members)

---

## 📋 Project Overview

**QuizCloud** is a full-stack cloud-based web application built for the Cloud Computing course project. It allows teachers to create and manage online quizzes, and students to attempt them in real time — with all data stored securely in **Google Firebase (Firestore)**.

The system demonstrates real-world use of cloud services including:
- Cloud-based NoSQL database (Firestore)
- Real-time data read/write operations
- Cloud hosting via Netlify
- CI/CD pipeline through GitHub

---

## 🌐 Live Demo

🔗 **[https://your-netlify-url.netlify.app](https://your-netlify-url.netlify.app)**


---

## ✨ Features

### 👩‍🏫 Teacher
- Register and login with email & password
- Create quizzes with multiple-choice questions (4 options each)
- Mark the correct answer for each question
- Set custom time limit (minutes) and pass mark (%)
- Publish quiz (active) or save as draft
- View, activate, or close any quiz
- See all student submissions with scores and pass/fail status
- View list of all registered students

### 🎓 Student
- Register and login with email & password
- Browse all active quizzes
- Attempt quizzes with a live countdown timer
- Progress bar showing answered questions
- Quiz auto-submits when time runs out
- See final score, percentage, and pass/fail result
- Review all answers with correct answers highlighted
- View full personal result history

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| Cloud Database | Firebase Firestore (NoSQL) |
| Cloud Hosting | Netlify (via GitHub) |
| Version Control | Git & GitHub |

---

## ☁️ Cloud Services

| Service | Purpose |
|---|---|
| **Firebase Firestore** | Store users, quizzes, and results in the cloud |
| **Netlify Hosting** | Deploy and host the web app publicly |
| **GitHub** | Version control and auto-deploy pipeline with Netlify |

---

## 📁 Project Structure

```
QuizCloud/
│
├── index.html                  ← Login & Register page
├── teacher-dashboard.html      ← Teacher interface
├── student-dashboard.html      ← Student interface
│
├── firebase-config.js          ← Firebase connection config
├── index.js                    ← Login/Register logic
├── teacher-dashboard.js        ← Teacher dashboard logic
├── student-dashboard.js        ← Student dashboard logic
│
└── README.md                   ← Project documentation
```

---

## 🔥 Firebase Setup

### Step 1 — Create Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add Project"** → name it `OnlineQuizSystem` → Create

### Step 2 — Create Firestore Database
1. In left sidebar → click **"Firestore"**
2. Click **"Create database"**
3. Select **"Start in test mode"** → Next → Done

### Step 3 — Set Firestore Rules
1. In Firestore → click the **"Rules"** tab
2. Replace everything with the following → click **Publish:**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Step 4 — Get Config Keys
1. Click gear icon → **Project Settings** → scroll to **Your apps**
2. Click **`</>`** (Web) → Register app → copy the config
3. Paste your keys into `firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

---

## 🚀 Running Locally

Since the app uses ES Modules, it must be run via a local server — not by double-clicking the HTML file.

### Option A — VS Code Live Server (Recommended)
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **"Open with Live Server"**
3. Opens at `http://127.0.0.1:5500`

### Option B — Python
```bash
python -m http.server 8080
```
Then open: `http://localhost:8080`

### Option C — Node.js
```bash
npx serve .
```

---

## 🌍 Deployment (Netlify + GitHub)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/muhammadbilalajmal/OnlineQuizSystem.git
git branch -M main
git push -u origin main
```

### Step 2 — Deploy on Netlify
1. Go to [netlify.com](https://netlify.com) → **"Add new site"** → **"Import from GitHub"**
2. Select your repository
3. Leave build command empty, set publish directory to `.`
4. Click **"Deploy site"**

### Step 3 — Add Netlify Domain to Firebase
1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Click **"Add domain"** → paste your Netlify URL (without `https://`)

### Step 4 — Update Code After Any Change
```bash
git add .
git commit -m "describe your update"
git push
```
Netlify auto-redeploys within seconds ✅

---

## 🗄 Firestore Database Schema

```
Firestore Database
│
├── users/
│   └── {email}
│       ├── name        : string
│       ├── email       : string
│       ├── password    : string
│       ├── role        : "teacher" | "student"
│       └── createdAt   : ISO date string
│
├── quizzes/
│   └── {auto-id}
│       ├── title       : string
│       ├── desc        : string
│       ├── timeLimit   : number (minutes)
│       ├── passmark    : number (%)
│       ├── status      : "active" | "draft" | "closed"
│       ├── createdBy   : email string
│       ├── teacherName : string
│       ├── createdAt   : ISO date string
│       └── questions   : Array [
│               {
│                 text    : string,
│                 options : [string, string, string, string],
│                 correct : number (0-3)
│               }
│           ]
│
└── results/
    └── {auto-id}
        ├── studentEmail  : string
        ├── studentName   : string
        ├── quizId        : string
        ├── quizTitle     : string
        ├── teacherEmail  : string
        ├── score         : number
        ├── total         : number
        ├── percentage    : number
        ├── passed        : boolean
        ├── answers       : array
        └── submittedAt   : ISO date string
```

---

## 👨‍💻 Group Members

| Name           | Roll No        | Role                                                                                              |
|----------------|----------------|---------------------------------------------------------------------------------------------------|
| Muhammad Bilal | 2022-BS-SE-130 | Frontend Development + Firebase Integration + UI/UX Design + Testing  + Documentation + Deployment|


---

## 📚 Course Information

| Field          | Detail                            |
|----------------|-----------------------------------|
| Course         | Cloud Computing                   |
| Program        | BS Software Engineering           |
| Semester       | 8th Semester                      |
| Project        | Cloud-Based Online Quiz System    |
| Cloud Platform | Firebase (Google Cloud) + Netlify |

---

## 📝 License

This project was created for academic purposes as part of the Cloud Computing course — BS Software Engineering program.
