import { Context } from "../Context";

export type NextMiddleware = () => Promise<void>;
export type MiddlewareChainItem = { middleware: Middleware; nextFunc?: NextMiddleware | null; }

export interface Middleware {
    name: symbol
    process(ctx: Context, next: NextMiddleware): Promise<void>;
}
