import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('TaskSphere API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.card.deleteMany();
    await prisma.column.deleteMany();
    await prisma.board.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('Authentication', () => {
    it('/auth/register (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('/auth/login (POST)', async () => {
      // First register a user
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      authToken = response.body.access_token;
    });
  });

  describe('Boards', () => {
    beforeEach(async () => {
      // Register and login to get auth token
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });
      authToken = response.body.access_token;
    });

    it('/boards (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/boards')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Board',
          description: 'A test board',
        })
        .expect(201);

      expect(response.body.title).toBe('Test Board');
      expect(response.body.description).toBe('A test board');
    });

    it('/boards (GET)', async () => {
      // Create a board first
      await request(app.getHttpServer())
        .post('/boards')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Board',
          description: 'A test board',
        });

      const response = await request(app.getHttpServer())
        .get('/boards')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Test Board');
    });
  });

  describe('Columns', () => {
    let boardId: string;

    beforeEach(async () => {
      // Register and login
      const authResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });
      authToken = authResponse.body.access_token;

      // Create a board
      const boardResponse = await request(app.getHttpServer())
        .post('/boards')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Board',
          description: 'A test board',
        });
      boardId = boardResponse.body.id;
    });

    it('/columns (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/columns')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'To Do',
          boardId,
          position: 0,
        })
        .expect(201);

      expect(response.body.title).toBe('To Do');
      expect(response.body.boardId).toBe(boardId);
    });
  });

  describe('Cards', () => {
    let boardId: string;
    let columnId: string;

    beforeEach(async () => {
      // Register and login
      const authResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });
      authToken = authResponse.body.access_token;

      // Create a board
      const boardResponse = await request(app.getHttpServer())
        .post('/boards')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Board',
          description: 'A test board',
        });
      boardId = boardResponse.body.id;

      // Create a column
      const columnResponse = await request(app.getHttpServer())
        .post('/columns')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'To Do',
          boardId,
          position: 0,
        });
      columnId = columnResponse.body.id;
    });

    it('/cards (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/cards')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Card',
          description: 'A test card',
          columnId,
          position: 0,
        })
        .expect(201);

      expect(response.body.title).toBe('Test Card');
      expect(response.body.columnId).toBe(columnId);
    });
  });
});