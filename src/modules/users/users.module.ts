import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserCrudRepository } from './repositories/user-crud.repository';
import { UserSearchRepository } from './repositories/user-search.repository';
import { UserCrudService } from './services/user-crud.service';
import { UserSearchService } from './services/user-search.service';
import { UserAuthService } from './services/user-auth.service';
import { UsersController } from './controllers/users.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    AuditModule,
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: 'IUserCrudService',
      useClass: UserCrudService,
    },
    {
      provide: 'IUserSearchService',
      useClass: UserSearchService,
    },
    {
      provide: 'IUserAuthService',
      useClass: UserAuthService,
    },
    {
      provide: 'IUserCrudRepository',
      useClass: UserCrudRepository,
    },
    {
      provide: 'IUserSearchRepository',
      useClass: UserSearchRepository,
    },
  ],
  exports: [
    'IUserCrudService',
    'IUserSearchService',
    'IUserAuthService',
  ],
})
export class UsersModule {}