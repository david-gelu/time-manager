# Time Manager Documentation

## Overview
Time Manager is a comprehensive task management application built with React, TypeScript, and Node.js. It helps users organize tasks, manage daily activities, and track progress through various views and features.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Components Guide](#components-guide)
- [API Documentation](#api-documentation)

## Features

### 1. Task Management
- Create daily tasks with titles and descriptions
- Set start and end dates
- Add subtasks with checklists
- Automatic status updates based on checklist completion
- Search functionality for finding tasks

### 2. Kanban Board
- Three columns: New, In Progress, Completed
- Visual task organization
- Real-time status updates
- Checklist progress tracking

### 3. Calendar View
- Weekly calendar layout
- Date selection and navigation
- Week number display
- Task date planning
- Date-based task filtering

### 4. Authentication
- Firebase authentication
- Protected routes
- User-specific task management
- Secure API endpoints

## Tech Stack

### Frontend
- React 18
- TypeScript
- TailwindCSS
- Shadcn/ui
- React Query
- React Router
- Firebase Auth

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- Firebase Admin SDK

## Project Structure

```
time-manager/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── types/
│   │   └── pages/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   └── middleware/
└── docs/
```

## Getting Started

### Prerequisites
- Node.js 16+
- MongoDB
- Firebase project
- Yarn package manager

### Installation Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd time-manager
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_CONFIG=your-firebase-config

# Backend (.env)
MONGODB_URI=your-mongodb-uri
FIREBASE_SERVICE_ACCOUNT_KEY=your-firebase-admin-key
```

4. Start development servers:
```bash
yarn dev
```

## Components Guide

### DailyTasks
- Main task management interface
- CRUD operations for tasks
- Subtask management
- Checklist functionality

### KanbanBoard
- Status column management
- Task card interactions
- Progress visualization

### Calendar
- Date selection
- Week number calculation
- Date-based navigation
- Task date management

## API Documentation

### Tasks Endpoints

#### GET /api/daily-tasks
- Get all daily tasks
- Optional search parameter
- Authentication required

#### POST /api/daily-tasks
- Create new daily task
- Requires task data in body
- Authentication required

#### PUT /api/daily-tasks/:id
- Update existing task
- Requires task ID and update data
- Authentication required

### Subtasks Endpoints

#### POST /api/sub-tasks/add-task
- Create new subtask
- Requires parent task ID
- Optional checklist items

#### PUT /api/sub-tasks/edit-task/:id
- Update subtask
- Supports checklist updates
- Automatic status updates

## Development Workflow

1. Feature Development
   - Create feature branch
   - Implement changes
   - Test locally
   - Create pull request

2. Testing
   - Run unit tests
   - Manual testing
   - UI/UX verification
   - Performance checks

3. Deployment
   - Build frontend
   - Build backend
   - Deploy to production
   - Monitor for issues

## Troubleshooting

Common issues and solutions:

1. Authentication Issues
   - Verify Firebase configuration
   - Check token expiration
   - Validate API headers

2. Database Connection
   - Check MongoDB connection string
   - Verify network access
   - Check credentials

3. API Errors
   - Validate request payload
   - Check authorization
   - Verify endpoint URLs

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - See LICENSE file for details