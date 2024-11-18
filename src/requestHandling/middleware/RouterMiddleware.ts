import { Context } from "../Context";
import { Middleware, NextMiddleware } from "./Middleware";
import { IActionResult } from "../results/IActionResult";
import { JsonResult } from "../results/JsonResult";
import { NotFoundResult } from "../results/NotFoundResult";

export class RouterMiddleware implements Middleware {
    public name = (Symbol(RouterMiddleware.name));

    public async process(ctx: Context, next: NextMiddleware) {    
        const result = await this.handle(ctx);
        result?.executeResult(ctx.output);
        await next();
    }

    private async handle(ctx: Context) {
        const { config } = ctx;

        const handler = config.router.match(ctx.output.request);
        if (!handler) {
            return new NotFoundResult();
        }

        ctx.matchedRoute = handler;
        ctx.params = ctx.matchedRoute.params || {};

        const handlerInstance = config.activator.createInstance(handler);
        const result = await handlerInstance.handle(ctx);

        if ((result as IActionResult).executeResult) {
            return result;
        } else {
            return new JsonResult(result);
        }
    }
}
