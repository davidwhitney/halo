import { Logger } from "../../observability/Logger";
import { Context } from "../Context";
import { Middleware, NextMiddleware } from "./Middleware";

export class LoggingMiddleware implements Middleware {
    async process(ctx: Context, next: NextMiddleware): Promise<void> {
        Logger.info("LMW: Request started for:", ctx.output.request.url);
        await next();
        Logger.info("LMW: Request finished");
    }
}