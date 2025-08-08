#!/bin/bash

echo "🚀 Starting TaskSphere Local Development Environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker and Docker Compose first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

echo "✅ Using: $COMPOSE_CMD"

# Create .env files if they don't exist
if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    cp .env.example .env
fi

if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
fi

echo "🔨 Building and starting containers..."
$COMPOSE_CMD up --build -d

echo "📊 Checking container status..."
$COMPOSE_CMD ps

echo ""
echo "🎉 TaskSphere is starting up!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3000"
echo "🗄️  Database: localhost:5432"
echo ""
echo "📋 Useful commands:"
echo "  View logs: $COMPOSE_CMD logs -f"
echo "  Stop services: $COMPOSE_CMD down"
echo "  Restart: $COMPOSE_CMD restart"
echo ""
echo "⏳ Please wait a few moments for all services to be ready..."