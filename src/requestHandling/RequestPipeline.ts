import { IOutputChannel } from "../adapters/IOutputChannel";
import { Logger } from "../observability/Logger";
import { RouteTable } from "../routing/RouteTable";
import { Activator } from "../typeActivation/Activator";
import { Context } from "./Context";
import { IActionResult } from "./IActionResult";
import { JsonResult } from "./JsonResult";

export class RequestPipeline {
    constructor(private router: RouteTable, private activator: Activator) { }

    public async processRequest(output: IOutputChannel) {
        try {

            // Look up handler
            const handler = this.router.match(output.request);
            if (!handler) {
                output.writeHeaders(404, {});
                output.writeBody('Not Found');
                output.end();
                return;
            }

            const ctx = new Context();
            const handlerInstance = this.activator.createInstance(handler);
            const result = await handlerInstance.handle(ctx);

            if ((result as IActionResult).executeResult) {
                (result as IActionResult).executeResult(output);
            } else {
                new JsonResult(result).executeResult(output);
            }

        } catch (error) {
            Logger.error("Pipeline error", error);
            new JsonResult({ error: 'Internal Server Error' }, 500).executeResult(output);
        }
    }
}
