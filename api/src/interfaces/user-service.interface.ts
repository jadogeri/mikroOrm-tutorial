

export interface UserServiceInterface{

  create(requestBody: { name: string; email: string }): Promise<any>;
  getOne(userId: number): Promise<any>;
  getAll(): Promise<any>;
  update(userId: number, requestBody: { name?: string; email?: string } ): Promise<any>;
  delete(userId: number): Promise<any>;
  
}
