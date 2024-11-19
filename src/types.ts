import { Context } from "./requestHandling/Context";
import { IActionResult } from "./requestHandling/results/IActionResult";

export type RouteHandler = { handle(ctx: Context): Promise<IActionResult>; }
export type RouteHandlerConstructor = { new (): RouteHandler; }
export type RouteHandlerFunction = (ctx: Context) => Promise<any>;

export type IHandleRoutes = RouteHandler 
    | RouteHandlerFunction 
    | RouteHandlerConstructor 
    | JSX.Element 
    | (<T = any>(props?: T) => JSX.Element)
    | (() => JSX.Element)
    | ((props: Context) => JSX.Element);

export interface RouteRegistration { 
    specifier: string; 
    verb: string;
    handler: IHandleRoutes;
    type?: RouteType;
    params?: Record<string, string>;
}

export type RequestMetadata = { url: string, method: string, headers: Record<string, string | string[]> };

export type RouteType = "constructor" | "function" | "jsx-element" | "react-component" | "handler-instance" | "unknown";

export type ErrorHandler = (error: unknown) => IActionResult;
