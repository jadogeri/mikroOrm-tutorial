import { EntityRepository } from "@mikro-orm/sqlite";
import { User } from "../entities/user.entity";

interface CustomUserRepositoryInterface {

    findByName(name: string): Promise<User | null>; 
    findByEmail(email: string): Promise<User | null>;

} 

export interface UserRepositoryInterface extends EntityRepository<User>, CustomUserRepositoryInterface {}




