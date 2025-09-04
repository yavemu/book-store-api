// Interface equivalent to user DTOs for internal processing

export interface ICreateUserData {
  username: string;
  email: string;
  password: string;
  roleId?: string;
}

export interface ICreateUserRequest {
  userData: ICreateUserData;
}

export interface IPagination {
  page: number;
  limit: number;
  offset?: number;
}

export interface IGetAllUsersRequest {
  pagination: IPagination;
}

export interface IGetUserByIdRequest {
  id: string;
}

export interface IUpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  roleId?: string;
}

export interface IUpdateUserRequest {
  id: string;
  updateData: IUpdateUserData;
}

export interface IDeleteUserRequest {
  id: string;
}

export interface ISearchUserData {
  searchTerm?: string;
  filters?: Record<string, any>;
}

export interface ISearchUsersRequest {
  searchData: ISearchUserData;
  pagination: IPagination;
}

export interface IFilterUsersRequest {
  term: string;
  pagination: IPagination;
}

export interface IAdvancedFilterUsersRequest {
  filters: Record<string, any>;
  pagination: IPagination;
}

export interface IExportUsersCsvRequest {
  filters?: Record<string, any>;
}