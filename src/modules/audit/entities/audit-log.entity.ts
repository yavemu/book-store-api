import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { AuditAction } from '../enums/audit-action.enum';

@Entity('audit_logs')
// Performance Critical Indexes
@Index(['performedBy'])
@Index(['entityId'])
@Index(['entityType'])
@Index(['action'])
@Index(['createdAt'])
@Index(['result'])
@Index(['environment'])
@Index(['executionContext'])
// Composite indexes for complex queries and exports
@Index(['performedBy', 'entityType'])
@Index(['entityId', 'action'])
@Index(['createdAt', 'performedBy'])
@Index(['createdAt', 'entityType'])
@Index(['createdAt', 'action'])
@Index(['action', 'result'])
@Index(['entityType', 'action', 'createdAt'])
@Index(['performedBy', 'createdAt', 'result'])
// Export optimization - covers most common export filters
@Index(['createdAt', 'entityType', 'action', 'performedBy'])
@Index(['createdAt', 'result', 'environment'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Primary key identifier for audit log entry',
  })
  id: string;

  @Column({
    name: 'performed_by',
    type: 'varchar',
    nullable: false,
    comment: 'ID of user who performed the action',
  })
  performedBy: string;

  @Column({
    name: 'entity_id',
    type: 'varchar',
    nullable: true,
    comment: 'ID of the entity that was affected (nullable for failed operations)',
  })
  entityId: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
    nullable: false,
    comment: 'Type of action performed (CREATE, UPDATE, DELETE, LOGIN, REGISTER)',
  })
  action: AuditAction;

  @Column({
    type: 'text',
    nullable: false,
    comment: 'Detailed description of the action performed',
  })
  details: string;

  @Column({
    name: 'entity_type',
    type: 'text',
    nullable: false,
    comment: 'Type of entity that was affected (User, Book, etc.)',
  })
  entityType: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'SUCCESS',
    nullable: false,
    comment: 'Result of the operation (SUCCESS, ERROR, VALIDATION_ERROR, UNAUTHORIZED, etc.)',
  })
  result: string;

  @Column({
    name: 'ip_address',
    type: 'varchar',
    length: 45,
    nullable: true,
    comment: 'IP address from where the action was performed',
  })
  ipAddress?: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Environment where action was performed (development, production, etc.)',
  })
  environment?: string;

  @Column({
    name: 'process_id',
    type: 'integer',
    nullable: true,
    comment: 'Process ID of the application when action was performed',
  })
  processId?: number;

  @Column({
    name: 'execution_context',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Context where the action was executed (e.g., UserRepository, AuthService)',
  })
  executionContext?: string;

  @Column({
    name: 'entity_snapshot',
    type: 'jsonb',
    nullable: true,
    comment: 'JSON snapshot of entity data at time of action',
  })
  entitySnapshot?: Record<string, any>;

  @Column({
    name: 'execution_time_ms',
    type: 'integer',
    nullable: true,
    comment: 'Execution time in milliseconds',
  })
  executionTimeMs?: number;

  @Column({
    name: 'error_details',
    type: 'text',
    nullable: true,
    comment: 'Detailed error information when result is not SUCCESS',
  })
  errorDetails?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Timestamp when audit log was created',
  })
  createdAt: Date;
}
