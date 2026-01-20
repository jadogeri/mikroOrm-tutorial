import { UserControllerInterface } from "../interfaces/user-controller.interface";
import { UserServiceInterface } from "../interfaces/user-service.interface";
import { Controller as BaseController, Body, Delete, Get, Post, Put, Route, Tags, Response, Path, Example, SuccessResponse, Res, TsoaResponse, Security, NoSecurity, Patch} from "tsoa";
import { AutoWired, Controller} from "../decorators.js";
import { TYPES } from "../types/di.type";
import { BadRequestError } from "../errors/bad-request.error";


@Route("users")
@Tags("User")
@Controller() 
export class UserController extends BaseController implements UserControllerInterface {

  @AutoWired(TYPES.UserServiceInterface)
  private readonly userService!: UserServiceInterface;

/**
 * Creates a new user with the provided name and email.
 * Validates input and delegates creation to the user service.
 * 
 * @param requestBody - Object containing 'name' and 'email' of the user.
 * @returns Promise resolving to the created user data.
 * @throws Error if 'name' or 'email' is missing in the requestBody.
 */
  @Post()
  async createUser(@Body() requestBody: { name: string; email: string }): Promise<any> {
    if (!requestBody.name || !requestBody.email) {
      throw new Error("Name and email are required");
    }
    return this.userService.create(requestBody);
  }

/**
 * Retrieves a user by their unique ID.
 * 
 * @param userId - The ID of the user to retrieve.
 * @returns A promise resolving to the user data.
 * @throws BadRequestError if userId is not provided.
 */
  @Get("/{userId}")
  async getUser(@Path() userId: number): Promise<any> {
    if (!userId) {
      throw new BadRequestError("User ID is required");
    }
    return this.userService.getOne(userId);
  }

  
/**
 * Retrieves all users from the user service.
 * No parameters required.
 * Returns a promise resolving to the list of users.
 * May throw an error if the user service fails.
 */
  @Get()
  async getUsers(): Promise<any> {
    return this.userService.getAll();
  }

  @Patch("/{userId}") 
  async updateUser(@Path() userId: number,@Body() requestBody: { name?: string; email?: string }): Promise<any> {
    if (!requestBody.name && !requestBody.email) {
      throw new BadRequestError("At least one of name or email is required");
    }
    if (!userId) {
      throw new BadRequestError("User ID is required");
    }
    return this.userService.update(userId, requestBody);
  }

  @Delete("/{userId}")
  async deleteUser(@Path() userId: number): Promise<any> {
    if (!userId) {
      throw new BadRequestError("User ID is required");
    }
    return this.userService.delete(userId);
  }
}   





