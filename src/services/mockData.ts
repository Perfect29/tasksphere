import { Board, Column, Card } from '../store/slices/boardsSlice';
import { User } from '../store/slices/authSlice';

// Mock user data
export const mockUser: User = {
  id: '1',
  email: 'demo@tasksphere.com',
  name: 'Demo User',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
};

// Mock cards data
const mockCards: Card[] = [
  {
    id: '1',
    title: 'Design user authentication flow',
    description: 'Create wireframes and mockups for the login and registration process',
    position: 0,
    columnId: '1',
    assignedTo: '1',
    dueDate: '2024-02-15',
    attachments: ['design.figma'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Implement JWT authentication',
    description: 'Set up JWT token-based authentication on the backend',
    position: 1,
    columnId: '1',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
  },
  {
    id: '3',
    title: 'Create board management API',
    description: 'Develop REST endpoints for CRUD operations on boards',
    position: 0,
    columnId: '2',
    assignedTo: '1',
    createdAt: '2024-01-17T11:00:00Z',
    updatedAt: '2024-01-17T11:00:00Z',
  },
  {
    id: '4',
    title: 'Setup WebSocket connections',
    description: 'Implement real-time updates using Socket.io',
    position: 1,
    columnId: '2',
    dueDate: '2024-02-20',
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-18T14:00:00Z',
  },
  {
    id: '5',
    title: 'Deploy to production',
    description: 'Set up CI/CD pipeline and deploy to AWS EC2',
    position: 0,
    columnId: '3',
    assignedTo: '1',
    dueDate: '2024-02-25',
    createdAt: '2024-01-19T16:00:00Z',
    updatedAt: '2024-01-19T16:00:00Z',
  },
];

// Mock columns data
const mockColumns: Column[] = [
  {
    id: '1',
    title: 'To Do',
    position: 0,
    boardId: '1',
    cards: mockCards.filter(card => card.columnId === '1'),
  },
  {
    id: '2',
    title: 'In Progress',
    position: 1,
    boardId: '1',
    cards: mockCards.filter(card => card.columnId === '2'),
  },
  {
    id: '3',
    title: 'Done',
    position: 2,
    boardId: '1',
    cards: mockCards.filter(card => card.columnId === '3'),
  },
];

// Mock boards data
export const mockBoards: Board[] = [
  {
    id: '1',
    title: 'TaskSphere Development',
    description: 'Main development board for the TaskSphere project',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
    members: ['1'],
    columns: mockColumns,
  },
  {
    id: '2',
    title: 'Marketing Campaign',
    description: 'Planning and execution of the Q1 marketing campaign',
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
    members: ['1'],
    columns: [
      {
        id: '4',
        title: 'Ideas',
        position: 0,
        boardId: '2',
        cards: [
          {
            id: '6',
            title: 'Social media strategy',
            description: 'Develop comprehensive social media marketing strategy',
            position: 0,
            columnId: '4',
            createdAt: '2024-01-12T10:00:00Z',
            updatedAt: '2024-01-12T10:00:00Z',
          },
        ],
      },
      {
        id: '5',
        title: 'In Review',
        position: 1,
        boardId: '2',
        cards: [],
      },
      {
        id: '6',
        title: 'Approved',
        position: 2,
        boardId: '2',
        cards: [],
      },
    ],
  },
  {
    id: '3',
    title: 'Bug Tracking',
    description: 'Track and resolve bugs found in the application',
    createdAt: '2024-01-14T12:00:00Z',
    updatedAt: '2024-01-19T09:15:00Z',
    members: ['1'],
    columns: [
      {
        id: '7',
        title: 'Reported',
        position: 0,
        boardId: '3',
        cards: [
          {
            id: '7',
            title: 'Login form validation issue',
            description: 'Email validation not working properly on the login form',
            position: 0,
            columnId: '7',
            assignedTo: '1',
            dueDate: '2024-02-10',
            createdAt: '2024-01-14T12:00:00Z',
            updatedAt: '2024-01-14T12:00:00Z',
          },
        ],
      },
      {
        id: '8',
        title: 'In Progress',
        position: 1,
        boardId: '3',
        cards: [],
      },
      {
        id: '9',
        title: 'Fixed',
        position: 2,
        boardId: '3',
        cards: [],
      },
    ],
  },
];

// Mock API responses
export const mockAuthResponse = {
  user: mockUser,
  token: 'mock-jwt-token-12345',
};

// Helper function to simulate API delay
export const simulateDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));