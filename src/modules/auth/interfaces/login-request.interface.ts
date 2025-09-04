// Interface equivalent to login-request.dto.ts

export interface ILoginData {
  email: string;
  password: string;
}

export interface ILoginRequest {
  loginData: ILoginData;
}