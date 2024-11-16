import { Context } from "./requestHandling/Context";
import { IActionResult } from "./requestHandling/results/IActionResult";

export type RouteHandler = { handle(ctx: Context): Promise<any>; }
export type RouteHandlerConstructor = { new (): RouteHandler; }
export type RouteHandlerFunction = (ctx: Context) => Promise<any>;
export type IHandleRoutes = RouteHandler | RouteHandlerFunction | RouteHandlerConstructor | JSX.Element;
export interface RouteRegistration { specifier: string; handler: IHandleRoutes; }

export type RequestMetadata = { url: string, method: string, headers: Record<string, string | string[]> };

export type ErrorHandler = (error: unknown) => IActionResult;
