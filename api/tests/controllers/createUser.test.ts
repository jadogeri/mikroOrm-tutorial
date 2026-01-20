import 'reflect-metadata'; // Required for Inversify
import { Container } from 'inversify';
import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { UserController } from '../../src/controllers/user.controller.js';
import { UserServiceInterface } from "../../src/interfaces/user-service.interface.js";
import { TYPES } from "../../src/types/di.type.js";

describe('UserController.createUser()', () => {
    let container: Container;
    let mockUserService: jest.Mocked<UserServiceInterface>;
    let controller: UserController;

    beforeEach(() => {
        container = new Container();

        // 1. Create a fully typed mock
        mockUserService = {
            create: jest.fn(),
            getOne: jest.fn(),
            getAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as any; // Cast as any only for the initial object creation

        // 2. Bind the mock to the container using your TYPES
        container.bind<UserServiceInterface>(TYPES.UserServiceInterface).toConstantValue(mockUserService);
        
        // 3. Bind the controller itself
        container.bind<UserController>(UserController).toSelf();

        // 4. Resolve the controller (this injects the mock automatically)
        controller = container.get<UserController>(UserController);
    });

    it('should create a user when valid name and email are provided', async () => {
        const requestBody = { name: 'John Doe', email: 'john@example.com' };
        const mockResponse = { id: 1, ...requestBody };
        
        mockUserService.create.mockResolvedValue(mockResponse as any);

        const result = await controller.createUser(requestBody);

        expect(mockUserService.create).toHaveBeenCalledWith(requestBody);
        expect(result).toEqual(mockResponse);
    });

    it('should throw an error if name is missing', async () => {
        const requestBody = { name: '', email: 'john@example.com' };

        // Ensure your controller has this validation logic
        await expect(controller.createUser(requestBody)).rejects.toThrow('Name and email are required');
        expect(mockUserService.create).not.toHaveBeenCalled();
    });

    it('should propagate service errors', async () => {
        mockUserService.create.mockRejectedValue(new Error('Database unique constraint failed'));
        const requestBody = { name: 'John', email: 'duplicate@test.com' };

        await expect(controller.createUser(requestBody)).rejects.toThrow('Database unique constraint failed');
    });
});
