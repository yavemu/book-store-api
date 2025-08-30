export interface IBookAuthorValidationRepository {
  checkFullNameExists(firstName: string, lastName: string): Promise<boolean>;
}
