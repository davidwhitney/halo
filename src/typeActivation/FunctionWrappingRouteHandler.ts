import { Context } from "../requestHandling/Context";
import { IActionResult } from "../requestHandling/results/IActionResult";
import { JsonResult } from "../requestHandling/results/JsonResult";
import { ReactComponentResult } from "../requestHandling/results/ReactComponentResult";
import { XmlResult } from "../requestHandling/results/XmlResult";
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

        // Object result
        return this.negotiateContentType(ctx, functionResult);
    }

    private negotiateContentType(ctx: Context, functionResult: any) {
        const contentTypeNegotiators = [
            JsonResult,
            XmlResult
        ];

        const acceptHeader = ctx.request.headers['accept'];
        if (!acceptHeader || acceptHeader === '*/*' || acceptHeader.length === 0) {
            return new JsonResult(functionResult);
        }

        for (const negotiatorCtor of contentTypeNegotiators) {
            const result = new negotiatorCtor(functionResult);
            if (result.respondsTo(acceptHeader)) {
                return result;
            }
        }

        return new JsonResult(functionResult);
    }
}
