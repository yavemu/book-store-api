import {
  UserListResponseDto,
  CreateUserResponseDto,
  UpdateUserResponseDto,
  DeleteUserResponseDto,
} from '../dto/user-response.dto';

// Response types for Users controller endpoints
export type PromiseGetAllUsersResponse = Promise<UserListResponseDto>;
export type PromiseGetUserByIdResponse = Promise<CreateUserResponseDto>;
export type PromiseGetUsersBySearchResponse = Promise<UserListResponseDto>;
export type PromiseGetUsersByFilterResponse = Promise<UserListResponseDto>;
export type PromiseGetUsersByAdvancedFilterResponse = Promise<UserListResponseDto>;
export type PromiseCreateUserResponse = Promise<CreateUserResponseDto>;
export type PromiseUpdateUserResponse = Promise<UpdateUserResponseDto>;
export type PromiseDeleteUserResponse = Promise<DeleteUserResponseDto>;
export type PromiseExportUsersCsvResponse = Promise<void>;
