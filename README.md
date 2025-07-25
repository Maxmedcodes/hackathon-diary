# hackathon-diary

# Hackathon Diary

A full-stack digital diary application that allows users to create, edit, search, and manage their daily diary entries. Built with a modern web interface and RESTful API backend.


## Installation & Setup

### Prerequisites
- Node.js (v14+)
- PostgreSQL database
- npm 

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hackathon-diary
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
1. Create a PostgreSQL database
2. Create `.env`  fileand configure your database URL:
```env
PORT={PORT}
DB_URL={DATABASE URL}
```

3. Run database setup:
```bash
npm run setup-db
```

### 4. Start the Application

**Development Mode (Recommended):**
```bash
npm run dev
```
This starts both backend and frontend servers concurrently.

**Backend Only:**
```bash
npm run dev:backend
```

**Frontend Only:**
```bash
npm run dev:frontend
```

### 5. Access the Application
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:3000`







