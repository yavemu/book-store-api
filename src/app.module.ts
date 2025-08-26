import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    PassportModule,
    JwtModule.register(jwtConfig),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}