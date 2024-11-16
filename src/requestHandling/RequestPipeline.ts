import { IOutputChannel } from "../adapters/IOutputChannel";
import { Logger } from "../observability/Logger"
import { RouteTable } from "../routing/RouteTable";
import { Activator } from "../typeActivation/Activator";
import { ErrorHandler } from "../types";
import { Context } from "./Context";
import { IActionResult } from "./results/IActionResult";
import { JsonResult } from "./results/JsonResult";

export class RequestPipeline {
    constructor(private router: RouteTable, private activator: Activator, private onError: ErrorHandler) {
    }

    public async processRequest(output: IOutputChannel) {
        Logger.debug('Processing request');

        const ctx: Context = { output };

        try {
            // Look up handler
            const handler = this.router.match(output.request);
            if (!handler) {
                output.writeHeaders(404, {});
                output.writeBody('Not Found');
                output.end();
                return;
            }

            ctx.matchedRoute = handler;

            const handlerInstance = this.activator.createInstance(handler);
            const result = await handlerInstance.handle(ctx);

            if ((result as IActionResult).executeResult) {
                (result as IActionResult).executeResult(output);
            } else {
                new JsonResult(result).executeResult(output);
            }

        } catch (error) {
            this.onError(error, ctx);
        }
    }
}
