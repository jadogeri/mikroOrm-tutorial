/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description Decorators for dependency injection and middleware in the application
 * 
 */

import { injectable, inject } from "inversify";
import { Middlewares } from "tsoa";

const Service = injectable;

const Repository = injectable;

const Controller = injectable;

const AutoWired = inject;

const Middleware = Middlewares

export { Service, Repository, Controller, Middleware, AutoWired  };