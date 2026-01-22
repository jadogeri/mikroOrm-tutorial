/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description User service for handling user-related operations
 * 
 */

import { AutoWired } from "../decorators";
import { User } from "../entities/user.entity";
import { ConflictError } from "../errors/conflict.error";
import { UserRepositoryInterface } from "../interfaces/user-repository.interface";
import { UserServiceInterface } from "../interfaces/user-service.interface";
import { TYPES } from "../types/di.type";
import { ResourceNotFoundError } from "../errors/resource-not-found.error";

export class UserService implements UserServiceInterface {

    @AutoWired(TYPES.UserRepositoryInterface)
    private readonly userRepository!:  UserRepositoryInterface;  
/**
 * Creates a new user if the name and email are unique.
 * Checks for existing users by name and email before creation.
 * Returns the newly created user entity.
 * 
 * @param requestBody - Object containing user details (name, email, etc.)
 * @returns Promise resolving to the created user entity.
 * @throws ConflictError if a user with the same name or email already exists.
 */
    async create(requestBody: any): Promise<any> {
        const { name, email } = requestBody;
        const userbyName = await this.userRepository.findByName(name);
        if (userbyName) {
            throw new ConflictError(`User with this name ${name} already exists`);
        }   
        const userbyEmail = await this.userRepository.findByEmail(email);
        if (userbyEmail) {
            throw new ConflictError(`User with this email ${email} already exists`);
        }
        const newUser : User=  this.userRepository.getEntityManager().create(User, requestBody);
        return newUser;
    }
/**
 * Retrieves a user by their unique ID from the repository.
 * Throws an error if the user is not found.
 * 
 * @param userId - The unique identifier of the user to retrieve.
 * @returns A promise that resolves to the user object.
 * @throws ResourceNotFoundError when no user with the given ID exists.
 */
    async getOne(userId: number): Promise<any> {
        const foundUser = await this.userRepository.findOne({ id: userId });
        if (!foundUser) {
            throw new ResourceNotFoundError(`User with ID ${userId} not found`);
        }
        return foundUser;
    }
/**
 * Retrieves all user records from the repository.
 * 
 * @returns Promise resolving to an array of user entities.
 * @throws Propagates any errors thrown by the userRepository.
 */
    async getAll(): Promise<any> {
        return await this.userRepository.findAll();
    }
    async update(userId: number, requestBody: any): Promise<any> {
        const foundUser = await this.userRepository.findOne({ id: userId });
        if (!foundUser) {
            throw new ResourceNotFoundError(`User with ID ${userId} not found`);
        }
        Object.assign(foundUser, requestBody);
        await this.userRepository.upsert(foundUser);   
        const updatedUser = await this.userRepository.findOne({ id: userId });
        return updatedUser;
    }
    async delete(userId: number): Promise<any> {
        const foundUser = await this.userRepository.findOne({ id: userId });
        if (!foundUser) {
            throw new ResourceNotFoundError(`User with ID ${userId} not found`);
        }
        this.userRepository.getEntityManager().remove(foundUser);
        await this.userRepository.getEntityManager().flush();
        return { message: `User with ID ${userId} has been deleted` };
    }
}
