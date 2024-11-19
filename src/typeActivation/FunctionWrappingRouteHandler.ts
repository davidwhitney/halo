import { Context } from "../requestHandling/Context";
import { IActionResult } from "../requestHandling/results/IActionResult";
import { JsonResult } from "../requestHandling/results/JsonResult";
import { ReactComponentResult } from "../requestHandling/results/ReactComponentResult";
import { RouteHandler, RouteHandlerFunction } from "../types";

export class FunctionWrappingRouteHandler implements RouteHandler {
    constructor(private callableFunc: RouteHandlerFunction) { }
    public async handle(ctx: Context) {
        const functionResult = await this.callableFunc(ctx);

        if ((functionResult as IActionResult).executeResult) {
            return functionResult;
        }

        // Edge case where functions return react components, we need to wrap them
        // in the correct kind of results so they get server rendered correctly.
        // Of all the places to put this hack, this is the best place.
        if (functionResult['$$typeof']?.toString() === "Symbol(react.element)") {
            return new ReactComponentResult(functionResult);
        }

        // Content negotiation could go here, but for now we'll just return JSON.
        return new JsonResult(functionResult);
    }
}
