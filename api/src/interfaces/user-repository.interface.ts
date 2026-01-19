import { User } from "../entities/user.entity";

interface CustomUserRepositoryInterface{

    findByName(name: string): Promise<User | null>; 

} 

export interface UserRepositoryInterface extends CustomUserRepositoryInterface {}