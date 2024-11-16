import { Logger } from "../../observability/Logger";
import { IActionResult } from "../results/IActionResult";
import { JsonResult } from "../results/JsonResult";

export function DeveloperPageErrorHandler(error: unknown): IActionResult {    
    Logger.error("Pipeline error", error);
    return new JsonResult({ 
        error: 'Internal Server Error',
        stack: error instanceof Error ? error.stack : undefined,
        details: error instanceof Error ? error.message : undefined,
        full: error
    }, 500);
}