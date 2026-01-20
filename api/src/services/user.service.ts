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
    async getOne(userId: number): Promise<any> {
        const foundUser = await this.userRepository.findOne({ id: userId });
        if (!foundUser) {
            throw new ResourceNotFoundError(`User with ID ${userId} not found`);
        }
        return foundUser;
    }
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
