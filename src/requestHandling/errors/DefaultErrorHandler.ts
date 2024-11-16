import { Logger } from "../../observability/Logger";
import { IActionResult } from "../results/IActionResult";
import { JsonResult } from "../results/JsonResult";

export function DefaultErrorHandler(error: unknown): IActionResult {    
    Logger.error("Pipeline error", error);
    return new JsonResult({ error: 'Internal Server Error' }, 500);
}