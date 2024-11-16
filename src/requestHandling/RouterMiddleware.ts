import { Logger } from "../observability/Logger"
import { Context } from "./Context";
import { Middleware, NextMiddleware } from "./middleware/Middleware";
import { IActionResult } from "./results/IActionResult";
import { JsonResult } from "./results/JsonResult";
import { NotFoundResult } from "./results/NotFoundResult";

export class RouterMiddleware implements Middleware {
    public async process(ctx: Context, next: NextMiddleware) {
        Logger.info("RHMW: Start");
    
        const result = await this.handle(ctx);
        result?.executeResult(ctx.output);

        await next();

        Logger.info("RHMW: End");
    }

    private async handle(ctx: Context) {
        const { config } = ctx;

        const handler = config.router.match(ctx.output.request);
        if (!handler) {
            return new NotFoundResult();
        }

        ctx.matchedRoute = handler;

        const handlerInstance = config.activator.createInstance(handler);
        const result = await handlerInstance.handle(ctx);

        if ((result as IActionResult).executeResult) {
            return result;
        } else {
            return new JsonResult(result);
        }
    }
}
