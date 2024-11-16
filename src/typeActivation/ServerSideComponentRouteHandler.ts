import { ComponentResult } from "../requestHandling/ComponentResult";
import { Context } from "../requestHandling/Context";
import { RouteHandlerClass } from "../types";

export class ServerSideComponentRouteHandler implements RouteHandlerClass {
    constructor(private component: JSX.Element) { }
    public async handle(ctx: Context) {
        return new ComponentResult(this.component, null);
    }
}
