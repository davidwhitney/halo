import { Context } from "../requestHandling/Context";
import { RouteHandler, RouteHandlerFunction } from "../types";

export class FunctionWrappingRouteHandler implements RouteHandler {
    constructor(private handler: RouteHandlerFunction) { }
    public async handle(ctx: Context) {
        return this.handler(ctx);
    }
}
