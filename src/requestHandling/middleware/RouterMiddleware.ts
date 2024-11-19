import { Context } from "../Context";
import { Middleware, NextMiddleware } from "./Middleware";
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
        const actionResult = await handlerInstance.handle(ctx);
        return actionResult;
    }
}
