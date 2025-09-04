export interface ICreateUserData {
  username: string;
  email: string;
  password: string;
  roleId: string;
}

export interface ICreateUserRequest {
  userData: ICreateUserData;
}