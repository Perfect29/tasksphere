"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("./../src/app.module");
const prisma_service_1 = require("../src/prisma/prisma.service");
describe('TaskSphere API (e2e)', () => {
    let app;
    let prisma;
    let authToken;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        prisma = app.get(prisma_service_1.PrismaService);
        await app.init();
    });
    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });
    beforeEach(async () => {
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
        let boardId;
        beforeEach(async () => {
            const authResponse = await request(app.getHttpServer())
                .post('/auth/register')
                .send({
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            });
            authToken = authResponse.body.access_token;
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
        let boardId;
        let columnId;
        beforeEach(async () => {
            const authResponse = await request(app.getHttpServer())
                .post('/auth/register')
                .send({
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            });
            authToken = authResponse.body.access_token;
            const boardResponse = await request(app.getHttpServer())
                .post('/boards')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                title: 'Test Board',
                description: 'A test board',
            });
            boardId = boardResponse.body.id;
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
//# sourceMappingURL=app.e2e-spec.js.map