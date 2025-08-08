import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@tasksphere.com' },
    update: {},
    create: {
      email: 'demo@tasksphere.com',
      password: hashedPassword,
      name: 'Demo User',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
  });

  // Create demo board
  const board = await prisma.board.upsert({
    where: { id: 'demo-board-1' },
    update: {},
    create: {
      id: 'demo-board-1',
      title: 'TaskSphere Demo Project',
      description: 'Welcome to TaskSphere! This is a demo board to showcase the features.',
      ownerId: user.id,
    },
  });

  // Create demo columns
  const todoColumn = await prisma.column.upsert({
    where: { id: 'demo-column-todo' },
    update: {},
    create: {
      id: 'demo-column-todo',
      title: 'To Do',
      position: 0,
      boardId: board.id,
    },
  });

  const inProgressColumn = await prisma.column.upsert({
    where: { id: 'demo-column-progress' },
    update: {},
    create: {
      id: 'demo-column-progress',
      title: 'In Progress',
      position: 1,
      boardId: board.id,
    },
  });

  const doneColumn = await prisma.column.upsert({
    where: { id: 'demo-column-done' },
    update: {},
    create: {
      id: 'demo-column-done',
      title: 'Done',
      position: 2,
      boardId: board.id,
    },
  });

  // Create demo cards
  await prisma.card.createMany({
    data: [
      {
        id: 'demo-card-1',
        title: 'Set up project structure',
        description: 'Initialize the TaskSphere project with proper folder structure and dependencies.',
        position: 0,
        columnId: doneColumn.id,
      },
      {
        id: 'demo-card-2',
        title: 'Implement authentication',
        description: 'Add JWT-based authentication with login and registration functionality.',
        position: 1,
        columnId: doneColumn.id,
      },
      {
        id: 'demo-card-3',
        title: 'Create board management',
        description: 'Allow users to create, edit, and delete boards with proper permissions.',
        position: 0,
        columnId: inProgressColumn.id,
      },
      {
        id: 'demo-card-4',
        title: 'Add drag and drop functionality',
        description: 'Implement smooth drag and drop for cards between columns.',
        position: 1,
        columnId: inProgressColumn.id,
      },
      {
        id: 'demo-card-5',
        title: 'Real-time collaboration',
        description: 'Add WebSocket support for real-time updates when multiple users work on the same board.',
        position: 0,
        columnId: todoColumn.id,
      },
      {
        id: 'demo-card-6',
        title: 'File upload integration',
        description: 'Integrate AWS S3 for file attachments on cards.',
        position: 1,
        columnId: todoColumn.id,
      },
      {
        id: 'demo-card-7',
        title: 'Mobile responsive design',
        description: 'Ensure the application works perfectly on mobile devices.',
        position: 2,
        columnId: todoColumn.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Database seeded successfully!');
  console.log('📧 Demo user: demo@tasksphere.com');
  console.log('🔑 Demo password: demo123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });