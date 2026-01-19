import { UserControllerInterface } from "../interfaces/user-controller.interface";
import { UserServiceInterface } from "../interfaces/user-service.interface";
import { Request, Controller as BaseController, Body, Delete, Get, Post, Put, Route, Tags, Response, Path, Example, SuccessResponse, Res, TsoaResponse, Security, NoSecurity, Patch} from "tsoa";
import { AutoWired, Controller, Middleware } from "../../decorators.js";
import { Request as ExpressRequest,Response as ExpressResponse } from "express";
import { TYPES } from "../types/di.type";


@Route("users")
@Tags("User")
@Controller() 
export class UserController extends BaseController implements UserControllerInterface {

  @AutoWired(TYPES.UserServiceInterface)
  private readonly userService!: UserServiceInterface;

  @Post()
  async createUser(@Body() requestBody: any): Promise<any> {
    return this.userService.create(requestBody);
  }

  @Get("/{userId}")
  async getUser(@Path() userId: string): Promise<any> {
    return this.userService.getOne(userId);
  }

  @Get()
  async getUsers(): Promise<any> {
    return this.userService.getAll();
  }

  @Patch("/{userId}")
  async updateUser(@Path() userId: string,@Body() requestBody: any): Promise<any> {
    return this.userService.update(userId, requestBody);
  }

  @Delete()
  async deleteUser(@Path() userId: string): Promise<any> {
    return this.userService.delete(userId);
  }
}   





