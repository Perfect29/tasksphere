# TaskSphere

A Trello-style task management app.  
Frontend — React + TypeScript + TailwindCSS.  
Backend — NestJS + PostgreSQL + Prisma.
Real-time updates via WebSocket.

## Features
- Create/edit boards, columns, and cards  
- Drag & drop tasks between columns  
- JWT authentication  
- Real-time updates (Socket.io) 

## Tech Stack
**Frontend:** React, TypeScript, Redux Toolkit, TailwindCSS  
**Backend:** NestJS, PostgreSQL, Prisma ORM, Socket.io,  
**Infrastructure:** Docker Compose, GitHub Actions 

## Run with Docker
- docker-compose up --build
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## API Overview
- /auth — authentication
- /boards — boards management
- /columns — columns management
- /cards — cards management
- /upload — file uploads
