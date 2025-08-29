export interface IUserAuthService {
  logLogin(userId: string): Promise<void>;
}
