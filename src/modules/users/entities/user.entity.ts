import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../enums/user-role.enum';
import { Role } from '../../roles/entities/role.entity';

@Entity('users')
@Index(['username'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['email'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['role'])
@Index(['createdAt'])
export class User {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Primary key identifier for user',
  })
  id: string;

  @Column({
    name: 'username',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
    comment: 'Unique username for authentication',
  })
  username: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Encrypted password for authentication',
  })
  password: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
    comment: 'Unique email address for user',
  })
  email: string;

  @Column({
    name: 'role_id',
    type: 'uuid',
    nullable: false,
    comment: 'Foreign key to roles table',
  })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.users, { nullable: false, eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Timestamp when user was created',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: 'Timestamp when user was last updated',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: 'Timestamp when user was soft deleted',
  })
  deletedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  normalizeUsername() {
    if (this.username) {
      this.username = this.username.toLowerCase().trim();
    }
  }
}
