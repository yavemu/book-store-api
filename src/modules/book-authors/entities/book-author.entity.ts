import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('book_authors')
// Basic Performance Indexes
@Index(['lastName'])
@Index(['firstName', 'lastName'])
@Index(['nationality'])
@Index(['createdAt'])
// Soft Delete Performance Index
@Index(['deletedAt'])
// Composite indexes for search and export operations
@Index(['lastName', 'firstName', 'deletedAt'])
@Index(['nationality', 'deletedAt'])
@Index(['createdAt', 'deletedAt'])
// Export optimization indexes
@Index(['createdAt', 'nationality', 'deletedAt'])
export class BookAuthor {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Primary key identifier for book author',
  })
  id: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: 'First name of the author',
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: 'Last name of the author',
  })
  lastName: string;

  @Column({
    name: 'nationality',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Nationality of the author',
  })
  nationality?: string;

  @Column({
    name: 'birth_date',
    type: 'date',
    nullable: true,
    comment: 'Birth date of the author',
  })
  birthDate?: Date;

  @Column({
    name: 'biography',
    type: 'text',
    nullable: true,
    comment: 'Biography or description of the author',
  })
  biography?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Timestamp when author was created',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: 'Timestamp when author was last updated',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: 'Timestamp when author was soft deleted',
  })
  deletedAt?: Date;
}
