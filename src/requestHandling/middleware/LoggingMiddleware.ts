import { Logger } from "../../observability/Logger";
import { Context } from "../Context";
import { Middleware, NextMiddleware } from "./Middleware";

export class LoggingMiddleware implements Middleware {
    public name = (Symbol(LoggingMiddleware.name));

    async process(ctx: Context, next: NextMiddleware): Promise<void> {
        Logger.info("Request started for:", ctx.output.request.url);

        await next();

        Logger.info("Request finished for:", ctx.output.request.url);
    }
}