
export interface UserControllerInterface{

  createUser(requestBody: { name: string; email: string }): Promise<any>;
  getUser(userId: number): Promise<any>;
  getUsers(): Promise<any>;
  updateUser(userId: number, requestBody: { name?: string; email?: string }): Promise<any>;
  deleteUser(userId: number): Promise<any>;
  
}