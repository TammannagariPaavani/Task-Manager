# Task Manager - MERN Stack Internship Assignment

A full-stack task management app with:

- User registration and login
- JWT authentication
- Protected task routes
- Create, update, delete, and view tasks
- Mark tasks as completed or pending
- Search, filter, and pagination
- Responsive UI built with React

## Tech Stack

- MongoDB / Mongoose
- Express.js
- React.js
- Node.js

## Project Structure

```text
task manager/
  server/
  client/
```

## Features

- Secure auth with hashed passwords
- Task CRUD with ownership checks
- Search by title or description
- Filter by status
- Pagination for task lists
- Clean responsive dashboard UI

## Setup

### 1. Install dependencies

Run this in each app folder:

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Configure environment variables

Create `server/.env`:

```env
PORT=4000
JWT_SECRET=change-this-secret
MONGODB_URI=mongodb://127.0.0.1:27017/task_manager
CLIENT_ORIGIN=http://localhost:5173
```

If you use MongoDB Compass, copy the same connection string from Compass into `MONGODB_URI`. Compass is only the GUI client, so the backend still needs a running MongoDB server or Atlas cluster.

### MongoDB Compass setup

1. Open MongoDB Compass.
2. Copy the connection string you use there.
3. Paste it into `server/.env` as `MONGODB_URI`.
4. Make sure the database server is reachable before starting the backend.

Create `client/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

### 3. Start the backend

```bash
cd server
npm run dev
```

### 4. Start the frontend

```bash
cd client
npm run dev
```

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `PATCH /api/tasks/:id/toggle`
- `DELETE /api/tasks/:id`

## Deliverables

- GitHub repository link
- README with setup instructions
- Screenshots or demo video if your teacher asks for visual proof

## Submission Focus

This project is built to emphasize:

- Fully functional application
- Secure authentication
- Smooth CRUD operations
- Clean UI and structured code
- Search and filter bonus
- Pagination bonus
- Deployment-ready env configuration
