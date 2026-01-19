
export interface UserControllerInterface{

  createUser(requestBody: any): Promise<any>;
  getUser(userId: string): Promise<any>;
  getUsers(): Promise<any>;
  updateUser(userId: string, requestBody: any): Promise<any>;
  deleteUser(userId: string): Promise<any>;
  
}