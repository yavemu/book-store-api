import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { databaseConfig } from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AuditModule } from './modules/audit/audit.module';
import { BookGenresModule } from './modules/book-genres/book-genres.module';
import { PublishingHousesModule } from './modules/publishing-houses/publishing-houses.module';
import { BookAuthorsModule } from './modules/book-authors/book-authors.module';
import { BookCatalogModule } from './modules/book-catalog/book-catalog.module';
import { BookAuthorAssignmentsModule } from './modules/book-author-assignments/book-author-assignments.module';
import { InventoryMovementsModule } from './modules/inventory-movements/inventory-movements.module';
import { RolesGuard } from './common/guards/roles.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    AuditModule,
    AuthModule,
    UsersModule,
    BookGenresModule,
    PublishingHousesModule,
    BookAuthorsModule,
    BookCatalogModule,
    BookAuthorAssignmentsModule,
    InventoryMovementsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
