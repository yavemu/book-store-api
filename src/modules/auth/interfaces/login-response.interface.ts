// Interface equivalent to login-response.dto.ts

export interface IUserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface ILoginResponse {
  data: {
    access_token: string;
    user: IUserProfile;
  };
  message: string;
}

export interface IRegisterResponse {
  data: {
    user: IUserProfile;
  };
  message: string;
}

export interface IUserProfileData {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfileResponse {
  data: IUserProfileData;
  message: string;
}