import { ReactComponentResult } from "../requestHandling/results/ReactComponentResult";
import { Context } from "../requestHandling/Context";
import { RouteHandler } from "../types";

export class ServerSideComponentRouteHandler implements RouteHandler {
    constructor(private component: JSX.Element) { }
    public async handle(ctx: Context) {
        return new ReactComponentResult(this.component, null);
    }
}
