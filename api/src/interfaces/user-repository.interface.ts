/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description User repository interface for handling user-related database operations
 * 
 */

import { EntityRepository } from "@mikro-orm/sqlite";
import { User } from "../entities/user.entity";

interface CustomUserRepositoryInterface {

    findByName(name: string): Promise<User | null>; 
    findByEmail(email: string): Promise<User | null>;

} 

export interface UserRepositoryInterface extends EntityRepository<User>, CustomUserRepositoryInterface {}




