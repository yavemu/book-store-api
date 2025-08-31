import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BookGenre } from '../../book-genres/entities/book-genre.entity';
import { PublishingHouse } from '../../publishing-houses/entities/publishing-house.entity';

@Entity('book_catalog')
// Basic Performance Indexes
@Index(['title'])
@Index(['isbnCode'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['price'])
@Index(['isAvailable'])
@Index(['genreId'])
@Index(['publisherId'])
@Index(['publicationDate'])
@Index(['createdAt'])
@Index(['stockQuantity'])
// Soft Delete Performance Index
@Index(['deletedAt'])
// Composite indexes for complex search and export operations
@Index(['isAvailable', 'stockQuantity'])
@Index(['genreId', 'isAvailable'])
@Index(['publisherId', 'isAvailable'])
@Index(['price', 'isAvailable'])
@Index(['publicationDate', 'isAvailable'])
@Index(['title', 'isAvailable', 'deletedAt'])
@Index(['genreId', 'publisherId', 'isAvailable'])
@Index(['createdAt', 'isAvailable', 'deletedAt'])
// Export optimization indexes
@Index(['createdAt', 'genreId', 'publisherId', 'isAvailable'])
@Index(['title', 'price', 'stockQuantity', 'deletedAt'])
export class BookCatalog {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Primary key identifier for book catalog entry',
  })
  id: string;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Title of the book',
  })
  title: string;

  @Column({
    name: 'isbn_code',
    type: 'varchar',
    length: 13,
    unique: true,
    nullable: false,
    comment: 'Unique ISBN code for the book',
  })
  isbnCode: string;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    comment: 'Price of the book',
  })
  price: number;

  @Column({
    name: 'is_available',
    type: 'boolean',
    default: true,
    nullable: false,
    comment: 'Indicates if the book is available for purchase',
  })
  isAvailable: boolean;

  @Column({
    name: 'stock_quantity',
    type: 'integer',
    default: 0,
    nullable: false,
    comment: 'Available stock quantity of the book',
  })
  stockQuantity: number;

  @Column({
    name: 'cover_image_url',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'URL of the book cover image',
  })
  coverImageUrl?: string;

  @Column({
    name: 'publication_date',
    type: 'date',
    nullable: true,
    comment: 'Date when the book was published',
  })
  publicationDate?: Date;

  @Column({
    name: 'page_count',
    type: 'integer',
    nullable: true,
    comment: 'Number of pages in the book',
  })
  pageCount?: number;

  @Column({
    name: 'summary',
    type: 'text',
    nullable: true,
    comment: 'Summary or description of the book',
  })
  summary?: string;

  @Column({
    name: 'genre_id',
    type: 'uuid',
    nullable: false,
    comment: 'Foreign key reference to book genre',
  })
  genreId: string;

  @Column({
    name: 'publisher_id',
    type: 'uuid',
    nullable: false,
    comment: 'Foreign key reference to publishing house',
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
    comment: 'Timestamp when book catalog entry was created',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: 'Timestamp when book catalog entry was last updated',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: 'Timestamp when book catalog entry was soft deleted',
  })
  deletedAt?: Date;
}
