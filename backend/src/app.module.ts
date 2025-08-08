import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { CardsModule } from './cards/cards.module';
import { ColumnsModule } from './columns/columns.module';
import { WebsocketModule } from './websocket/websocket.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'tasksphere-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    PrismaModule,
    AuthModule,
    BoardsModule,
    CardsModule,
    ColumnsModule,
    WebsocketModule,
    UploadModule,
  ],
})
export class AppModule {}