import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  DeleteDateColumn,
  Index
} from 'typeorm';

@Entity('book_genres')
@Index(['genreName'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['createdAt'])
export class BookGenre {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Primary key identifier for book genre'
  })
  id: string;

  @Column({ 
    name: 'genre_name',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
    comment: 'Unique name of the book genre'
  })
  genreName: string;

  @Column({
    name: 'genre_description',
    type: 'text',
    nullable: true,
    comment: 'Detailed description of the book genre'
  })
  genreDescription?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Timestamp when genre was created'
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: 'Timestamp when genre was last updated'
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: 'Timestamp when genre was soft deleted'
  })
  deletedAt?: Date;
}