import { Logger } from "../../observability/Logger";
import { Context } from "../Context";
import { JsonResult } from "../results/JsonResult";

export function DeveloperPageErrorHandler(error: unknown, ctx: Context): void {    
    Logger.error("Pipeline error", error);
    new JsonResult({ 
        error: 'Internal Server Error',
        stack: error instanceof Error ? error.stack : undefined,
        details: error instanceof Error ? error.message : undefined,
        full: error
    }, 500).executeResult(ctx.output);
}