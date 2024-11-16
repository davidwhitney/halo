import { Context } from "./requestHandling/Context";

export type RouteHandlerClass = { handle(ctx: Context): Promise<any>; }
export type RouteHandlerConstructor = { new (): RouteHandlerClass; }
export type RouteHandlerFunction = (ctx: Context) => Promise<any>;
export type RouteHandler = RouteHandlerClass | RouteHandlerFunction | RouteHandlerConstructor | JSX.Element;
export interface RouteRegistration { specifier: string; handler: RouteHandler; }

export type RequestMetadata = { url: string, method: string, headers: Record<string, string | string[]> };

export type ErrorHandler = (error: unknown, ctx: Context) => void;
