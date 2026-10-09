# SkillSwap 🔄 | AI-Powered Student Skill Exchange Platform
SkillSwap uses semantic AI to discover students with complementary skills on campus. Match directly, exchange knowledge peer-to-peer, and grow together.

> **"Teach what you know. Learn what you want."**  
> SkillSwap is an intelligent, reciprocal skill-exchange platform tailored for university students. Using AI, it analyzes natural-language skill descriptions, identifies bilateral complementary pairings (e.g., Python ↔ UI/UX Design), and calculates compatibility scores to recommend peer mentors on campus.

---

## 🌟 Table of Contents
1. [The Problem & Vision](#-the-problem--vision)
2. [Key Features](#-key-features)
3. [Architecture & Tech Stack](#-architecture--tech-stack)
4. [Project Structure](#-project-structure)
5. [Quick Start (Beginner's Step-by-Step Guide)](#-quick-start-beginners-step-by-step-guide)

---

## 🎯 The Problem & Vision

Many students have valuable technical or creative abilities they can teach, but also lack complementary skills for their side projects, coursework, or career goals.
- **Student A (Computer Science)** can teach **Python** but desperately needs to learn **UI/UX Design with Figma** to create portfolio apps.
- **Student B (Design)** can teach **UI/UX Design** but wants to learn **Python** for automated prototyping.

Without a smart platform, these students rarely find each other. **SkillSwap** solves this with an AI-first matching workflow:

$$\text{User Skills} \longrightarrow \text{AI Semantic Understanding} \longrightarrow \text{Bilateral Matching} \longrightarrow \text{Direct Connection}$$

---

## ✨ Key Features

1. **Natural-Language Skill Input:**
   Students aren't restricted to rigid dropdown tags. A student can enter *"I build backend APIs with Python"* and the AI semantically understands the connection to *"Python programming"*.
2. **AI Reciprocal Matching Engine:**
   Powered by Google Gemini 1.5 Flash (with structured JSON output). Evaluates target student needs against candidate skills to score compatibility ($0\%\text{–}100\%$) and formulate a customized suggested exchange ($A \leftrightarrow B$).
3. **Intelligent Local Fallback Matcher:**
   If no Gemini API key is configured or network is unavailable, SkillSwap automatically switches to an internal semantic clustering matcher. **Your hackathon demo will never crash on stage.**
4. **Student Matching Dashboard:**
   Sorted from highest compatibility to lowest. Clear visual cards showing:
   - Compatibility score ($90\%+$ Mutual Exchange, $60\%\text{–}85\%$ Strong Match)
   - Suggested Exchange banner
   - AI Reasoning explanation
   - Skill chips with experience levels (Beginner, Intermediate, Advanced)
5. **Real-Time Search & Filters:**
   Filter matches by keyword (e.g. *Python*, *Figma*, *Video*, *Pitching*), filter by Mutual Exchanges, or toggle between *"Skills I want to learn"* and *"Skills I can teach"*.
6. **One-Click Connect & Persona Switcher:**
   Interactive modal with pre-generated personalized outreach message and student email contact. Top-bar persona switcher lets you browse as different students during presentations.
7. **Pre-Seeded Complementary Dataset:**
   Includes 10 realistic university student profiles with intentionally paired complementary skill sets.
8. **Gender & Interactive Avatar Gallery:**
   Choose gender as **Male**, **Female**, or **Other**. Pick from gender presets or 5 neutral characters (*Nova Bot*, *Echo Spark*, *Pixel Hero*, *Sparky Emoji*, *Orbit Gear*) that do not imply gender.

---

## 🏗️ Architecture & Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express, ES Modules.
- **AI Service:** Google Gemini 1.5 Flash via `@google/generative-ai` SDK.
- **Database:** Local JSON File Data Store (`data/users.json` with auto-reset capability).
- **Communication:** RESTful API with Vite proxy on port `5173` pointing to backend port `5000`.

---

## 📁 Project Structure

```
skillswap/
├── package.json              # Root runner (starts client & server together)
├── dev.js                    # Concurrent startup script
├── .gitignore                # Excludes node_modules and .env
├── README.md                 # Documentation
│
├── server/                   # Backend Node.js / Express API
│   ├── package.json
│   ├── index.js              # Express entry point & CORS configuration
│   ├── dataStore.js          # File-based JSON database manager
│   ├── .env.example          # Environment variable template
│   ├── .env                  # Local secret config (GEMINI_API_KEY)
│   ├── routes/
│   │   ├── users.js          # GET /api/users, POST /api/users, reset
│   │   └── match.js          # POST /api/match (AI Skill Matching endpoint)
│   ├── services/
│   │   ├── geminiService.js  # Google Gemini 1.5 Flash client & prompt
│   │   └── fallbackMatcher.js# Built-in local semantic clustering engine
│   ├── data/
│   │   ├── sampleUsers.json  # 10 pristine seed profiles
│   │   └── users.json        # Active working database
│   └── test/
│       └── api.test.js       # Unit tests for matching & data integrity
│
└── client/                   # Frontend React Application
    ├── package.json
    ├── vite.config.js        # Vite config with /api proxy to port 5000
    ├── tailwind.config.js    # Tailwind color palette & styles
    ├── index.html
    └── src/
        ├── main.jsx          # React DOM entry
        ├── App.jsx           # Main application shell & routing
        ├── index.css         # Tailwind styles & animations
        ├── services/
        │   └── api.js        # API client for backend endpoints
        ├── components/
        │   ├── Navbar.jsx    # Top navigation & persona switcher
        │   ├── MatchCard.jsx # Skill match card with compatibility score
        │   ├── SkillBadge.jsx# Skill tag with level indicator
        │   ├── ConnectModal.jsx# Peer outreach dialog
        │   └── ProfileModal.jsx# Full student profile view
        └── pages/
            ├── LandingPage.jsx   # Hero banner & demo scenarios
            ├── DashboardPage.jsx # "Your Best Skill Matches" grid
            └── ProfilePage.jsx   # Create & edit student profile
```

---

## 🚀 Quick Start (Beginner's Step-by-Step Guide)

### Prerequisites
Make sure **Node.js** (version 18 or higher) is installed on your computer.  
Verify in your terminal:
```bash
node -v
npm -v
```

### 1. Installation
In the project root folder:
```bash
npm run install:all
```
*(Or navigate to `server` and run `npm install`, then navigate to `client` and run `npm install`)*.

### 2. Starting the Application
You can run both client and server together with one single command from the root folder:
```bash
npm run dev
```

Alternatively, open two separate terminal windows:
- **Terminal 1 (Backend):**
  ```bash
  cd server
  npm start
  ```
  *Server runs at: `http://localhost:5000`*

- **Terminal 2 (Frontend):**
  ```bash
  cd client
  npm run dev
  ```
  *Frontend opens at: `http://localhost:5173`*

Open **`http://localhost:5173`** in your browser!

---

## 🔑 Gemini AI Setup & Secure Configuration

SkillSwap is designed to keep your secret API key safely on the backend server. The browser never sees the key.

1. Get a free API key from **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
2. Open the file `server/.env`.
3. Paste your key:
   ```env
   PORT=5000
   GEMINI_API_KEY=AIzaSy...your_actual_key_here
   ```
4. Restart the server (`npm start` in `server/`).
5. In the SkillSwap dashboard, the AI status badge will display **Google Gemini 1.5 Flash**.

---

## 🛡️ Intelligent Fallback Matching (Zero-Downtime Demo)

What happens if you don't have an API key or the network drops during your presentation?  
**SkillSwap will never fail.**

SkillSwap includes an intelligent **Local Semantic Fallback Matcher** (`server/services/fallbackMatcher.js`) that uses tokenization and semantic domain clustering (programming, UI/UX design, video editing, public speaking, statistics, music, languages, finance, databases) to calculate compatibility scores and formulate suggested exchanges offline.

The dashboard displays which engine powered the recommendation so you can show the judges both the live Gemini model and the resilient fallback system!

---

## 👥 Sample Personas for Hackathon Demonstrations

| Persona | College & Major | Can Teach | Wants to Learn | Top Complementary Match |
| :--- | :--- | :--- | :--- | :--- |
| **Ananya Sharma** | Apex Institute (CS) | Python, Canva, Public Speaking | UI/UX Design, Video Editing | **Rahul Verma** (94% - Python ↔ UI/UX) |
| **Rahul Verma** | National Design Inst (Design) | UI/UX & Figma, Graphic Design | Python Programming, Web Dev | **Ananya Sharma** (94% - UI/UX ↔ Python) |
| **Priya Nair** | Metro Univ (Media) | Video Editing, Storytelling | Public Speaking, Interviews | **Rohan Mehta** (92% - Video ↔ Speaking) |
| **Rohan Mehta** | City Business (Business) | Public Speaking & Pitching, Excel | Video Editing, Canva | **Priya Nair** (92% - Speaking ↔ Video) |
| **Maya Patel** | Tech Institute (Data Sci) | Machine Learning, Statistics | React Frontend, Tailwind | **Carlos Gomez** (95% - ML ↔ React) |
| **Carlos Gomez** | Metro Engineering (Web) | React, JavaScript | Machine Learning, Data Analysis | **Maya Patel** (95% - React ↔ ML) |
| **Sarah Jenkins** | Liberal Arts (Languages) | Conversational Spanish, Writing | Acoustic Guitar, Music Theory | **David Chen** (95% - Spanish ↔ Guitar) |
| **David Chen** | Music Conservatory (Audio) | Acoustic Guitar, Music Production | Spanish, Creative Writing | **Sarah Jenkins** (95% - Guitar ↔ Spanish) |
| **Aisha Al-Mansoor**| Global Business (Finance) | Personal Finance, Advanced Excel | SQL Databases, Python Auto | **Vikram Rao** (93% - Excel ↔ SQL) |
| **Vikram Rao** | Engineering (Databases) | SQL Databases, Python Scripting | Personal Finance, Excel | **Aisha Al-Mansoor** (93% - SQL ↔ Finance) |

---

## 🎤 Hackathon Demo Pitch Guide

**1. The Hook (30 sec):**  
*"Hi everyone! Every student has skills they can teach—whether it's Python, Figma, or video editing—and skills they wish someone could mentor them in. But finding someone on campus whose skills complement yours is practically impossible without spending hours asking around. That's why we built **SkillSwap**."*

**2. The Live Demo (90 sec):**  
1. Open the **Landing Page** and show the visual comparison: *"Student A knows Python and wants Design; Student B knows Design and wants Python."*
2. Click **"Best Matches"** to open the dashboard as **Ananya**:
   - Point out **Rahul Verma** at the top with a **94% Compatibility** badge.
   - Read the AI suggested exchange: *"You teach Rahul Python Programming ↔ Rahul teaches you UI/UX Design & Figma"*.
   - Point out the AI reasoning explaining why the match is optimal.
3. Click the **"Requests"** tab in the top navbar:
   - Notice the **Pending Notification Badge (1)**!
   - View the incoming request from **Rahul Verma** proposing a swap.
   - Click **"Accept Swap"**! Watch the status update with a celebration banner and unlocked email contact.
4. Go back to **Matches**, find **Priya Nair** or another student, click **"Connect"**, and send a swap request.
5. Use the top navbar persona switcher to browse as **Priya Nair** or **Rahul Verma** to show how requests sync across student profiles!
6. Click **"My Profile"** to show how easy it is to add free-form skills in natural language.

**3. The Technical Highlight (30 sec):**  
*"Under the hood, SkillSwap utilizes Google Gemini 1.5 Flash to semantically evaluate skill sets and extract bilateral pairings. Furthermore, we implemented an offline semantic fallback matcher to guarantee zero downtime even under flaky venue WiFi."*

---

## 🧪 Testing & Verification

Run the automated backend test suite from the `server/` directory:
```bash
npm test
```
The test verifies:
- Data store loading with all 10 sample profiles
- Semantic parsing and bidirectional pairing
- High compatibility scores ($>80\%$) across all intentional complementary student pairs
