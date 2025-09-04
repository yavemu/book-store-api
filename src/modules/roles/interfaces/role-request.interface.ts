// Interface equivalent to role DTOs for internal processing

export interface ICreateRoleData {
  name: string;
  description?: string;
}

export interface ICreateRoleRequest {
  roleData: ICreateRoleData;
}

export interface IPagination {
  page: number;
  limit: number;
  offset?: number;
}

export interface IGetAllRolesRequest {
  pagination: IPagination;
}

export interface IGetRoleByIdRequest {
  id: string;
}

export interface IUpdateRoleData {
  name?: string;
  description?: string;
}

export interface IUpdateRoleRequest {
  id: string;
  updateData: IUpdateRoleData;
}

export interface IDeleteRoleRequest {
  id: string;
}

export interface ISearchRolesRequest {
  searchTerm: string;
  pagination: IPagination;
}