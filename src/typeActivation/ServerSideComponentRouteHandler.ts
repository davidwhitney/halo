import { ComponentResult } from "../requestHandling/results/ComponentResult";
import { Context } from "../requestHandling/Context";
import { RouteHandler } from "../types";

export class ServerSideComponentRouteHandler implements RouteHandler {
    constructor(private component: JSX.Element) { }
    public async handle(ctx: Context) {
        return new ComponentResult(this.component, null);
    }
}
