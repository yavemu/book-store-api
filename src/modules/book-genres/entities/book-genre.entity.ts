import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('book_genres')
// Basic Performance Indexes
@Index(['name'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['createdAt'])
// Soft Delete Performance Index
@Index(['deletedAt'])
// Composite indexes for search and export operations
@Index(['name', 'deletedAt'])
@Index(['createdAt', 'deletedAt'])
export class BookGenre {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Primary key identifier for book genre',
  })
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
    comment: 'Unique name of the book genre',
  })
  name: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
    comment: 'Detailed description of the book genre',
  })
  description?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Timestamp when genre was created',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: 'Timestamp when genre was last updated',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: 'Timestamp when genre was soft deleted',
  })
  deletedAt?: Date;
}
