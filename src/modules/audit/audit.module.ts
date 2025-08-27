import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditLogRepository } from './repositories/audit-log.repository';
import { AuditLogService } from './services/audit-log.service';
import { AuditController } from './audit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditController],
  providers: [
    {
      provide: 'IAuditLogService',
      useClass: AuditLogService,
    },
    {
      provide: 'IAuditLogRepository',
      useClass: AuditLogRepository,
    },
  ],
  exports: ['IAuditLogService', 'IAuditLogRepository'],
})
export class AuditModule {}