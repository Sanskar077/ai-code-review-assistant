# AI Code Review Assistant

<p align="center">
  <img src="docs/assets/logo.png" alt="AI Code Review Assistant" width="140"/>
</p>

<h3 align="center">
AI-Powered Code Review Platform
</h3>

<p align="center">
A full-stack web application that performs automated code reviews using Artificial Intelligence and static code analysis, helping developers write cleaner, more secure, and maintainable code.
</p>

---

## 📌 Overview

The **AI Code Review Assistant** is a modern full-stack application designed to automate software code reviews. It combines **Artificial Intelligence**, **static code analysis**, and **software quality metrics** to provide developers with meaningful feedback on their source code.

Instead of relying solely on manual reviews, the application enables users to submit code snippets, receive AI-generated suggestions, identify potential issues, and monitor code quality through an intuitive dashboard.

The project demonstrates modern web development practices including secure authentication, RESTful APIs, database management, AI integration, and responsive frontend design.

---

# ✨ Features

## Authentication

- User Registration
- Secure Login
- JWT Authentication
- HTTP-Only Cookie Sessions
- Protected Routes
- Logout

---

## AI Code Review

- AI-powered code analysis
- Code quality suggestions
- Best practice recommendations
- Maintainability improvements
- Performance suggestions
- Readability analysis

---

## Static Analysis

- ESLint integration
- Syntax validation
- Common coding issue detection
- Code formatting guidance

---

## Dashboard

- Review statistics
- User activity overview
- Code review history
- Quality metrics
- Performance insights

---

## Review History

- Previous submissions
- Detailed review reports
- AI responses
- Static analysis results

---

## Security

- Password hashing (bcrypt)
- JWT Authentication
- Cookie-based authentication
- Input validation
- Protected API routes
- Environment variable management

---

# 🛠 Technology Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- React Hook Form
- TanStack Query
- Zod
- Axios
- Lucide React

---

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM

---

## Database

- PostgreSQL

---

## AI

- OpenRouter API

---

## Static Analysis

- ESLint

---

# 📁 Project Structure

```
AI-Code-Review-Assistant
│
├── client/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── styles/
│   └── package.json
│
├── server/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.ts
│   └── package.json
│
└── README.md
```

---

# 🏗 System Architecture

```
                User
                  │
                  ▼
          Next.js Frontend
                  │
                  ▼
          Express REST API
                  │
      ┌───────────┴────────────┐
      ▼                        ▼
 PostgreSQL              OpenRouter AI
      │
      ▼
 Prisma ORM
```

---

# 🔄 Application Workflow

1. User logs into the application.
2. User submits source code.
3. Backend validates the request.
4. Static analysis is performed.
5. AI analyzes the submitted code.
6. Results are stored in PostgreSQL.
7. Detailed review is displayed to the user.
8. Review history is available for future reference.

---

# 🔒 Authentication Flow

```
User
   │
Login
   │
Validate Credentials
   │
Generate JWT
   │
Store HTTP-Only Cookie
   │
Authenticated Session
```

---

# 🗄 Database

The application uses **PostgreSQL** through **Prisma ORM**.

Typical entities include:

- Users
- Code Reviews
- Review Results
- Metrics
- Authentication

---

# ⚙ Environment Variables

## Backend (.env)

```env
DATABASE_URL=

JWT_SECRET=

COOKIE_NAME=acr_token

CLIENT_URL=http://localhost:3000

OPENROUTER_API_KEY=

OPENROUTER_MODEL=
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone <repository-url>
cd AI-Code-Review-Assistant
```

---

## Backend

```bash
cd server

npm install

npx prisma generate

npx prisma migrate dev

npm run dev
```

---

## Frontend

```bash
cd client

npm install

npm run dev
```

---

# 📦 Production Build

## Backend

```bash
npm run build

npm start
```

## Frontend

```bash
npm run build

npm start
```

---

# 🌐 Deployment

## Backend

- Render

## Frontend

- Vercel

## Database

- PostgreSQL

---

# 📈 Future Enhancements

- Multi-language support
- GitHub Integration
- Pull Request Reviews
- Team Workspaces
- CI/CD Integration
- Docker Support
- Kubernetes Deployment
- Review Templates
- Advanced AI Models
- Export Reports
- Admin Dashboard

---

# 📸 Screenshots

Add screenshots here before final submission.

- home
<img width="1366" height="2329" alt="screencapture-localhost-3000-2026-07-19-18_43_07" src="https://github.com/user-attachments/assets/479e4df5-de6b-480a-9fce-04764ee90965" />

- Register
<img width="1366" height="657" alt="screencapture-localhost-3000-register-2026-07-19-18_44_36" src="https://github.com/user-attachments/assets/20ec8db6-69cb-48af-a6d8-9f5bb45d588f" />

- Login
<img width="1366" height="645" alt="screencapture-localhost-3000-login-2026-07-19-18_45_21" src="https://github.com/user-attachments/assets/09e630aa-1584-4ce3-89ee-a63439d6ca32" />

- Dashboard
<img width="1365" height="646" alt="image" src="https://github.com/user-attachments/assets/43b8655c-fdae-428a-88bf-168789f4d394" />

- Code Review
<img width="1365" height="648" alt="image" src="https://github.com/user-attachments/assets/35d60c96-7f3f-4f99-9ef9-565dda417f08" />

- Review Result
<img width="1366" height="979" alt="screencapture-localhost-3000-dashboard-new-review-2026-07-19-18_50_20" src="https://github.com/user-attachments/assets/45bd48fb-f01e-495d-a936-c9ff965c5026" />

- History
<img width="1365" height="643" alt="image" src="https://github.com/user-attachments/assets/2827ce13-0eb1-4f77-aee7-1b3a931945cf" />

- Profile
<img width="1364" height="645" alt="image" src="https://github.com/user-attachments/assets/84211401-5a32-42b8-b2ce-5a252924a4af" />

---

# 👨‍💻 Author

**Developer:** Your Name

Diploma in Computer Engineering

---

# 📄 License

This project was developed for educational and internship purposes.

---

# 🙏 Acknowledgements

- OpenRouter
- Prisma
- Next.js
- React
- Express.js
- PostgreSQL
- Tailwind CSS
- TypeScript
- ESLint

---

## ⭐ Thank You

If you found this project useful, consider giving it a ⭐ on GitHub.
