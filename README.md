# JobBridge - Intelligent Job & Internship Portal

An advanced full-stack job platform connecting students with recruiters. Features an integrated **ATS (Applicant Tracking System) Resume Analyzer** to match candidates effectively and validate applications.

## 🚀 Key Features

*   **Smart ATS Analysis**:
    *   Automatically scans uploaded resumes (PDF) for keywords and content quality.
    *   **Fraud Prevention**: Rejects low-quality, empty, or fake submissions (non-PDFs).
    *   **Scoring**: Calculates a match score based on job requirements.
*   **Role-Based Access**:
    *   **Students**: Create profiles, upload resumes, search & apply for jobs, track application status.
    *   **Recruiters**: Post jobs, manage applications, view candidate ATS scores.
*   **Secure & Robust**:
    *   **Data Validation**: Strict PDF-only upload policy.
    *   **Self-Healing**: Auto-rectifies missing user profiles during the application process.
    *   **JWT Authentication**: Secure login sessions for all users.

## 🛠️ Tech Stack

*   **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion
*   **Backend**: Node.js, Express.js, PostgreSQL (Sequelize ORM)
*   **Tools**:
    *   `pdf-parse` (Resume Analysis)
    *   `multer` (Secure File Uploads)
    *   `bcryptjs` & `jsonwebtoken` (Security)

## 📦 Installation & Setup

1.  **Clone the Repository**
2.  **Install Dependencies**:
    ```bash
    cd backend && npm install
    cd ../frontend && npm install
    ```
3.  **Configure Database**:
    -   Ensure PostgreSQL is running on port 5432.
    -   The system will auto-sync tables on start.
4.  **Run Application**:
    ```bash
    # Terminal 1 (Start Backend API on Port 5000)
    cd backend
    npm run dev

    # Terminal 2 (Start Frontend UI on Port 5173)
    cd frontend
    npm run dev
    ```

## 📝 Usage

-   **Frontend**: [http://localhost:5173](http://localhost:5173)
-   **Backend API**: [http://localhost:5000](http://localhost:5000)

## 🛡️ Security Features
-   **Input Validation**: Protects against SQL injection and invalid data.
-   **File Security**: Only valid PDF files with readable text are accepted for resumes.

---
*Built for the Modern Job Market.*
