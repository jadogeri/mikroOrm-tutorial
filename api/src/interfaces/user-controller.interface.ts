/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description User controller interface for handling user-related operations
 * 
 */
export interface UserControllerInterface{

  createUser(requestBody: { name: string; email: string }): Promise<any>;
  getUser(userId: number): Promise<any>;
  getUsers(): Promise<any>;
  updateUser(userId: number, requestBody: { name?: string; email?: string }): Promise<any>;
  deleteUser(userId: number): Promise<any>;
  
}