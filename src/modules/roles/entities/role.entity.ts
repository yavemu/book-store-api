import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("roles")
@Index(["name"], { unique: true, where: "deleted_at IS NULL" })
@Index(["createdAt"])
export class Role {
  @PrimaryGeneratedColumn("uuid", {
    comment: "Primary key identifier for role",
  })
  id: string;

  @Column({
    name: "name",
    type: "varchar",
    length: 50,
    unique: true,
    nullable: false,
    comment: "Role name (ADMIN, USER, MANAGER, etc.)",
  })
  name: string;

  @Column({
    name: "description",
    type: "text",
    nullable: true,
    comment: "Role description and permissions",
  })
  description?: string;

  @Column({
    name: "permissions",
    type: "jsonb",
    nullable: true,
    comment: "Permissions array for role",
    default: () => "'[]'",
  })
  permissions?: string[];

  @Column({
    name: "is_active",
    type: "boolean",
    default: true,
    nullable: false,
    comment: "Whether the role is active or not",
  })
  isActive: boolean;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    comment: "Role creation timestamp",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    comment: "Role last update timestamp",
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: "deleted_at",
    type: "timestamp",
    nullable: true,
    comment: "Soft delete timestamp",
  })
  deletedAt?: Date;

  // Relations
  @OneToMany(() => User, (user) => user.role, { lazy: true })
  users: User[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeRoleName() {
    if (this.name) {
      this.name = this.name.toLowerCase().trim();
    }
  }
}
