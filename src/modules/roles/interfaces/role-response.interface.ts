export interface IRoleProfile {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoleResponse {
  data: IRoleProfile;
  message: string;
}

export interface IRolesListResponse {
  data: IRoleProfile[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message: string;
}

export interface IDeleteRoleResponse {
  data: { id: string };
  message: string;
}