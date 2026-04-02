# Daily Tasks — Full-Stack Task Management App

> A productivity application for managing daily tasks, tracking progress through Kanban and Calendar views, and coordinating across global time zones.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=flat-square&logo=vercel)](https://time-manager-frontend.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-96.8%25-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

---

## 📸 Preview

<!-- Replace with actual screenshot: ![App Preview](./docs/preview.png) -->
> 🔗 **[View live app →](https://time-manager-frontend.vercel.app)**

---

## ✨ Features

### Task Management
- Create tasks with title, description, and date range
- Add **subtasks** with nested checklist items
- Automatic status updates based on checklist completion:
  - No items checked → **New**
  - Some items checked → **In Progress**
  - All items checked → **Completed**
- Search tasks by name

### Kanban Board
- Three-column view: **New / In Progress / Completed**
- Drag and drop tasks between columns
- Real-time status sync with checklist progress

### Calendar View
- Weekly layout with week number display
- Date navigation and "Today" shortcut
- Date-based task filtering and planning

### Time Zone Converter
- Convert time across **195+ countries and territories**
- Compare multiple time zones simultaneously
- Interactive calendar with time picker (24h format)
- UTC offset display per zone
- Support for major cities within countries (Sydney, Toronto, Melbourne, etc.)

### Authentication
- Firebase Authentication (Google Sign-In)
- Protected routes — user-specific task management
- Secure API endpoints with Firebase Admin SDK

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| React Query | Server state management |
| React Router | Client-side routing |
| Firebase Auth | Authentication |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Firebase Admin SDK | Token verification |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Yarn
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Firebase project](https://console.firebase.google.com/) with Authentication enabled


### Environment Variables

**Frontend** — create `frontend/.env`:
```env
VITE_API_URL=http://localhost:port
VITE_FIREBASE_CONFIG=your-firebase-config
```

**Backend** — create `backend/.env`:
```env
MONGODB_URI=your-mongodb-connection-string
FIREBASE_SERVICE_ACCOUNT_KEY=your-firebase-admin-key
PORT=port
```

### Run in development

```bash
yarn dev
```

Frontend runs at [http://localhost:port](http://localhost:port) · Backend runs at [http://localhost:port](http://localhost:port)

---

## 📁 Project Structure

```
time-manager/
├── frontend/
│   └── src/
│       ├── components/    # DailyTasks, KanbanBoard, Calendar, TimeZone
│       ├── pages/
│       ├── lib/
│       └── types/
├── backend/
│   └── src/
│       ├── routes/
│       ├── models/
│       └── middleware/    # Firebase auth middleware
├── api/                   # Shared API utilities
├── docs/
└── vercel.json
```

---

## 🔌 API Reference

All endpoints require a valid Firebase ID token in the `Authorization` header.

### Daily Tasks

| Method | Endpoint | Description |
|---|---|---|
| `GET` | Get all tasks (supports `?search=`) |
| `POST` | Create a new task |
| `PUT` | Update a task |
| `DELETE` |  Delete a task |

### Subtasks

| Method | Endpoint | Description |
|---|---|---|
| `POST` |  Add subtask to a task |
| `PUT` | Update subtask / checklist items |

---

## 📦 Deployment

The frontend is deployed on **Vercel**. The `vercel.json` handles SPA routing.

```bash
vercel --prod
```

---

## 👤 Author

**David Gelu-Fanel** — Full-Stack Developer

[![Portfolio](https://img.shields.io/badge/Portfolio-davidgelu.netlify.app-teal?style=flat-square)](https://davidgelu.netlify.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-gelu--fanel--david-blue?style=flat-square&logo=linkedin)](https://linkedin.com/in/gelu-fanel-david)
[![GitHub](https://img.shields.io/badge/GitHub-david--gelu-black?style=flat-square&logo=github)](https://github.com/david-gelu)

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.