/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description User service interface for handling user-related operations
 * 
 */

export interface UserServiceInterface{

  create(requestBody: { name: string; email: string }): Promise<any>;
  getOne(userId: number): Promise<any>;
  getAll(): Promise<any>;
  update(userId: number, requestBody: { name?: string; email?: string } ): Promise<any>;
  delete(userId: number): Promise<any>;
  
}
