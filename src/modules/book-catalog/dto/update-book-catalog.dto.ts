import { PartialType } from '@nestjs/swagger';
import { CreateBookCatalogDto } from './create-book-catalog.dto';

export class UpdateBookCatalogDto extends PartialType(CreateBookCatalogDto) {}
