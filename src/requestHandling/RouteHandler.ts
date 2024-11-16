import { Logger } from "../observability/Logger"
import { RouteTable } from "../routing/RouteTable";
import { Activator } from "../typeActivation/Activator";
import { ErrorHandler } from "../types";
import { Context } from "./Context";
import { IActionResult } from "./results/IActionResult";
import { JsonResult } from "./results/JsonResult";
import { NotFoundResult } from "./results/NotFoundResult";

export class RouteHandler {
    constructor(private router: RouteTable, private activator: Activator, private onError: ErrorHandler) {
    }

    public async processRequest(ctx: Context) {
        Logger.debug('Processing request');

        try {
            const handler = this.router.match(ctx.output.request);
            if (!handler) {
                return new NotFoundResult();
            }

            ctx.matchedRoute = handler;

            const handlerInstance = this.activator.createInstance(handler);
            const result = await handlerInstance.handle(ctx);

            if ((result as IActionResult).executeResult) {
                return result;
            } else {
                return new JsonResult(result);
            }
        } catch (error) {
            return this.onError(error);
        }
    }
}
