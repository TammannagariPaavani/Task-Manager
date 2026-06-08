# Task Manager

A full-stack task management application built for MERN .

## Overview

This project provides a clean, responsive task workspace with:

- User registration and login
- JWT authentication
- Protected routes
- Task creation, update, deletion, and status toggle
- Search, filter, and pagination
- Structured code with a modern React UI

## Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express.js
- Database: MongoDB
- Auth: JSON Web Token

## Project Structure

```text
task manager/
  client/
  server/
```

## Setup

### 1. Install dependencies

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
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/task_manager?retryWrites=true&w=majority
CLIENT_ORIGIN=http://localhost:5173
```

Use a reachable MongoDB connection string. If you use MongoDB Atlas, add your current IP in Network Access.

Create `client/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

### 3. Start the apps

```bash
cd server
npm run dev
```

In another terminal:

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


## Notes

- The application is intended to run against a real MongoDB database.
- For Atlas, make sure your IP is whitelisted and the cluster is active.
- The client expects the API to be available at `VITE_API_URL`.
