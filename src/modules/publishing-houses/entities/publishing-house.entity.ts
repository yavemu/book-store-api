import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('publishing_houses')
@Index(['name'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['country'])
@Index(['createdAt'])
export class PublishingHouse {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Primary key identifier for publishing house',
  })
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
    comment: 'Unique name of the publishing house',
  })
  name: string;

  @Column({
    name: 'country',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Country where the publishing house is located',
  })
  country?: string;

  @Column({
    name: 'website_url',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Official website URL of the publishing house',
  })
  websiteUrl?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Timestamp when publishing house was created',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: 'Timestamp when publishing house was last updated',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: 'Timestamp when publishing house was soft deleted',
  })
  deletedAt?: Date;
}
