import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  Unique
} from 'typeorm';
import { BookCatalog } from '../../book-catalog/entities/book-catalog.entity';
import { BookAuthor } from '../../book-authors/entities/book-author.entity';

@Entity('book_author_assignments')
@Index(['bookId'])
@Index(['authorId'])
@Unique(['bookId', 'authorId'])
@Index(['createdAt'])
export class BookAuthorAssignment {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Primary key identifier for book-author assignment'
  })
  id: string;

  @Column({
    name: 'book_id',
    type: 'uuid',
    nullable: false,
    comment: 'Foreign key reference to book catalog'
  })
  bookId: string;

  @Column({
    name: 'author_id',
    type: 'uuid',
    nullable: false,
    comment: 'Foreign key reference to book author'
  })
  authorId: string;

  @ManyToOne(() => BookCatalog, { eager: false })
  @JoinColumn({ name: 'book_id' })
  book: BookCatalog;

  @ManyToOne(() => BookAuthor, { eager: false })
  @JoinColumn({ name: 'author_id' })
  author: BookAuthor;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Timestamp when assignment was created'
  })
  createdAt: Date;
}