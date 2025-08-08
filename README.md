# TaskSphere: Collaborative Task Management Platform

<div align="center">
  <img src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop&crop=center" alt="TaskSphere Logo" width="120" height="120" style="border-radius: 20px;">
  
  <h3>A modern, full-stack Trello-like application for collaborative task management</h3>
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
</div>

## 🚀 Features

### ✨ Core Functionality
- **Real-time Collaboration** - Multiple users can work on boards simultaneously with WebSocket updates
- **Drag & Drop Interface** - Smooth, intuitive card management between columns
- **JWT Authentication** - Secure user registration and login system
- **Board Management** - Create, edit, and organize multiple project boards
- **File Uploads** - AWS S3 integration for card attachments
- **Responsive Design** - Works seamlessly on desktop and mobile devices

### 🛠 Technical Excellence
- **Modern Architecture** - Clean, maintainable code following best practices
- **Type Safety** - Full TypeScript implementation across frontend and backend
- **Real-time Updates** - WebSocket integration for live collaboration
- **Database Migrations** - Prisma ORM with automated schema management
- **Comprehensive Testing** - Unit and E2E tests with Jest
- **CI/CD Pipeline** - GitHub Actions for automated testing and deployment
- **Docker Support** - Containerized development and production environments

## 🏗 Architecture

### Frontend Stack
- **React 18** with TypeScript for modern UI development
- **Redux Toolkit** for predictable state management
- **TailwindCSS** for utility-first styling
- **@dnd-kit** for smooth drag-and-drop interactions
- **Socket.io Client** for real-time communication

### Backend Stack
- **NestJS** with TypeScript for scalable API development
- **PostgreSQL** with Prisma ORM for robust data management
- **JWT** for secure authentication
- **Socket.io** for WebSocket real-time features
- **Multer** for file upload handling

### DevOps & Infrastructure
- **Docker Compose** for local development environment
- **GitHub Actions** for CI/CD pipeline
- **AWS S3** integration for file storage
- **PostgreSQL** database with automated migrations

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Docker** and Docker Compose
- **Git** for version control

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/tasksphere.git
cd tasksphere
```

### 2. Environment Setup
Create environment files:

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

**Backend (.env)**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tasksphere
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# AWS S3 Configuration (Optional for local development)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=tasksphere-uploads
```

### 3. Start with Docker Compose (Recommended)
```bash
# Quick start with build (recommended for first run)
docker-compose up --build

# Or use the provided script
./start-local.sh

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

### 4. Manual Setup (Alternative)

#### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with demo data
npm run prisma:seed

# Start development server
npm run start:dev
```

#### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Tests
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Build test
npm run build
```

## 📦 Production Deployment

### AWS EC2 Deployment

#### 1. Server Setup
```bash
# Connect to your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Docker and Docker Compose
sudo apt update
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker ubuntu

# Clone the repository
git clone https://github.com/your-username/tasksphere.git
cd tasksphere
```

#### 2. Production Configuration
Create production environment files:

```bash
# Production environment
cp .env.example .env.production
# Edit with your production values
```

#### 3. Deploy with Docker
```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
docker-compose exec backend npx prisma migrate deploy

# Check logs
docker-compose logs -f
```

#### 4. Nginx Configuration (Optional)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🗂 Project Structure

```
tasksphere/
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/          # Reusable UI components
│   │   │   ├── 📁 auth/           # Authentication components
│   │   │   ├── 📁 board/          # Board-related components
│   │   │   ├── 📁 layout/         # Layout components
│   │   │   └── 📁 ui/             # Base UI components
│   │   ├── 📁 pages/              # Page components
│   │   ├── 📁 store/              # Redux store and slices
│   │   ├── 📁 services/           # API and WebSocket services
│   │   └── 📁 hooks/              # Custom React hooks
│   ├── 📄 package.json
│   └── 📄 vite.config.ts
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 auth/               # Authentication module
│   │   ├── 📁 boards/             # Board management module
│   │   ├── 📁 cards/              # Card management module
│   │   ├── 📁 columns/            # Column management module
│   │   ├── 📁 upload/             # File upload module
│   │   ├── 📁 websocket/          # WebSocket gateway
│   │   └── 📁 prisma/             # Database service
│   ├── 📁 prisma/                 # Database schema and migrations
│   ├── 📁 test/                   # E2E tests
│   ├── 📄 package.json
│   └── 📄 Dockerfile
├── 📁 .github/workflows/          # CI/CD pipelines
├── 📄 docker-compose.yml          # Development environment
├── 📄 docker-compose.prod.yml     # Production environment
└── 📄 README.md
```

## 🔧 API Documentation

### Authentication Endpoints
```
POST /auth/register    # User registration
POST /auth/login       # User login
GET  /auth/profile     # Get user profile
```

### Board Management
```
GET    /boards         # Get user's boards
POST   /boards         # Create new board
GET    /boards/:id     # Get board details
PATCH  /boards/:id     # Update board
DELETE /boards/:id     # Delete board
```

### Column Management
```
GET    /columns/board/:boardId    # Get board columns
POST   /columns                   # Create column
PATCH  /columns/:id              # Update column
DELETE /columns/:id              # Delete column
```

### Card Management
```
GET    /cards/column/:columnId    # Get column cards
POST   /cards                     # Create card
PATCH  /cards/:id                # Update card
DELETE /cards/:id                # Delete card
PATCH  /cards/:id/move           # Move card
```

### File Upload
```
POST /upload/file      # Upload file attachment
```

## 🔌 WebSocket Events

### Connection Events
```javascript
// Join board for real-time updates
socket.emit('join-board', { boardId, userId });

// Leave board
socket.emit('leave-board', { boardId });
```

### Board Events
```javascript
// Listen for board updates
socket.on('board-updated', (data) => {
  // Handle board update
});
```

### Card Events
```javascript
// Card moved between columns
socket.on('card-moved', (data) => {
  // Handle card movement
});

// Card created/updated/deleted
socket.on('card-created', (data) => {});
socket.on('card-updated', (data) => {});
socket.on('card-deleted', (data) => {});
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run the test suite**: `npm test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure code passes linting and type checking
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing frontend framework
- **NestJS Team** for the powerful backend framework
- **Prisma Team** for the excellent database toolkit
- **Tailwind CSS** for the utility-first CSS framework
- **Socket.io** for real-time communication capabilities

## 📞 Support

If you have any questions or need help:

- 📧 **Email**: support@tasksphere.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/tasksphere/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/tasksphere/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/your-username/tasksphere/wiki)

---

<div align="center">
  <p>Built with ❤️ by the TaskSphere Development Team</p>
  <p>⭐ Star this repository if you find it helpful!</p>
  <p>© 2024 TaskSphere. All rights reserved.</p>
</div>