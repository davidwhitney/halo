import { Logger } from "../../observability/Logger";
import { Context } from "../Context";
import { JsonResult } from "../results/JsonResult";

export function DefaultErrorHandler(error: unknown, ctx: Context): void {    
    Logger.error("Pipeline error", error);
    new JsonResult({ error: 'Internal Server Error' }, 500).executeResult(ctx.output);
}