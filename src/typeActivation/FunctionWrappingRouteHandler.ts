import { Context } from "../requestHandling/Context";
import { RouteHandlerClass, RouteHandlerFunction } from "../types";

export class FunctionWrappingRouteHandler implements RouteHandlerClass {
    constructor(private handler: RouteHandlerFunction) { }
    public async handle(ctx: Context) {
        return this.handler(ctx);
    }
}
