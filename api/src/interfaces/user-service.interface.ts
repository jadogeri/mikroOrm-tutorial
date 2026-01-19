

export interface UserServiceInterface{

  create(requestBody: any): Promise<any>;
  getOne(userId: string): Promise<any>;
  getAll(): Promise<any>;
  update(userId: string, requestBody: any): Promise<any>;
  delete(userId: string): Promise<any>;
  
}