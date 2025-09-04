export interface IUserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse {
  data: IUserProfile;
  message: string;
}

export interface IUsersListResponse {
  data: IUserProfile[];
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

export interface IDeleteUserResponse {
  data: { id: string };
  message: string;
}