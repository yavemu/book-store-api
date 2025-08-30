import { PartialType } from '@nestjs/swagger';
import { CreatePublishingHouseDto } from './create-publishing-house.dto';

export class UpdatePublishingHouseDto extends PartialType(CreatePublishingHouseDto) {}
