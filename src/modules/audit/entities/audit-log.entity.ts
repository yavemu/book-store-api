import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { AuditAction } from '../enums/audit-action.enum';

@Entity("audit_logs")
@Index(["performedBy"])
@Index(["entityId"])
@Index(["entityType"])
@Index(["action"])
@Index(["createdAt"])
@Index(["performedBy", "entityType"])
@Index(["entityId", "action"])
export class AuditLog {
  @PrimaryGeneratedColumn("uuid", {
    comment: "Primary key identifier for audit log entry",
  })
  id: string;

  @Column({
    name: "performed_by",
    type: "varchar",
    nullable: false,
    comment: "ID of user who performed the action",
  })
  performedBy: string;

  @Column({
    name: "entity_id",
    type: "varchar",
    nullable: false,
    comment: "ID of the entity that was affected",
  })
  entityId: string;

  @Column({
    type: "enum",
    enum: AuditAction,
    nullable: false,
    comment: "Type of action performed (CREATE, UPDATE, DELETE, LOGIN, REGISTER)",
  })
  action: AuditAction;

  @Column({
    type: "text",
    nullable: false,
    comment: "Detailed description of the action performed",
  })
  details: string;

  @Column({
    name: "entity_type",
    type: "text",
    nullable: false,
    comment: "Type of entity that was affected (User, Book, etc.)",
  })
  entityType: string;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    comment: "Timestamp when audit log was created",
  })
  createdAt: Date;
}