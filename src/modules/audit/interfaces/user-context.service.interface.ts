export interface IUserContextService {
  extractUserId(request: any): string;
  getCurrentUser(request: any): { id: string; [key: string]: any };
}
