import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { BookGenre } from '../../book-genres/entities/book-genre.entity';
import { PublishingHouse } from '../../publishing-houses/entities/publishing-house.entity';

@Entity('book_catalog')
@Index(['bookTitle'])
@Index(['isbnCode'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['bookPrice'])
@Index(['isAvailable'])
@Index(['genreId'])
@Index(['publisherId'])
@Index(['publicationDate'])
@Index(['createdAt'])
export class BookCatalog {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Primary key identifier for book catalog entry'
  })
  id: string;

  @Column({ 
    name: 'book_title',
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Title of the book'
  })
  bookTitle: string;

  @Column({
    name: 'isbn_code',
    type: 'varchar',
    length: 13,
    unique: true,
    nullable: false,
    comment: 'Unique ISBN code for the book'
  })
  isbnCode: string;

  @Column({
    name: 'book_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    comment: 'Price of the book'
  })
  bookPrice: number;

  @Column({
    name: 'is_available',
    type: 'boolean',
    default: true,
    nullable: false,
    comment: 'Indicates if the book is available for purchase'
  })
  isAvailable: boolean;

  @Column({
    name: 'stock_quantity',
    type: 'integer',
    default: 0,
    nullable: false,
    comment: 'Available stock quantity of the book'
  })
  stockQuantity: number;

  @Column({
    name: 'book_cover_image_url',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'URL of the book cover image'
  })
  bookCoverImageUrl?: string;

  @Column({
    name: 'publication_date',
    type: 'date',
    nullable: true,
    comment: 'Date when the book was published'
  })
  publicationDate?: Date;

  @Column({
    name: 'page_count',
    type: 'integer',
    nullable: true,
    comment: 'Number of pages in the book'
  })
  pageCount?: number;

  @Column({
    name: 'book_summary',
    type: 'text',
    nullable: true,
    comment: 'Summary or description of the book'
  })
  bookSummary?: string;

  @Column({
    name: 'genre_id',
    type: 'uuid',
    nullable: false,
    comment: 'Foreign key reference to book genre'
  })
  genreId: string;

  @Column({
    name: 'publisher_id',
    type: 'uuid',
    nullable: false,
    comment: 'Foreign key reference to publishing house'
  })
  publisherId: string;

  @ManyToOne(() => BookGenre, { eager: false })
  @JoinColumn({ name: 'genre_id' })
  genre: BookGenre;

  @ManyToOne(() => PublishingHouse, { eager: false })
  @JoinColumn({ name: 'publisher_id' })
  publisher: PublishingHouse;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Timestamp when book catalog entry was created'
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: 'Timestamp when book catalog entry was last updated'
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: 'Timestamp when book catalog entry was soft deleted'
  })
  deletedAt?: Date;
}