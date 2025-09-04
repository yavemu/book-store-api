// Interface equivalent to register-request.dto.ts

export interface IRegistrationData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId: string;
}

export interface IRegisterRequest {
  registrationData: IRegistrationData;
}