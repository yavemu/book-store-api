import { PublishingHouse } from '../entities/publishing-house.entity';
import { CreatePublishingHouseDto } from '../dto/create-publishing-house.dto';
import { UpdatePublishingHouseDto } from '../dto/update-publishing-house.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { ListSelectDto } from '../../../common/dto/list-select.dto';

export interface IPublishingHouseCrudService {
  create(
    createPublishingHouseDto: CreatePublishingHouseDto,
    performedBy: string,
  ): Promise<PublishingHouse>;
  findAll(pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>>;
  findById(id: string): Promise<PublishingHouse>;
  update(
    id: string,
    updatePublishingHouseDto: UpdatePublishingHouseDto,
    performedBy: string,
  ): Promise<PublishingHouse>;
  softDelete(id: string, performedBy: string): Promise<{ id: string }>;
  findForSelect(): Promise<ListSelectDto[]>;
}
