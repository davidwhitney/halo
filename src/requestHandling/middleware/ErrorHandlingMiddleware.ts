import { Context } from "../Context";
import { Middleware, NextMiddleware } from "./Middleware";

export class ErrorHandlingMiddleware implements Middleware {    
    public name = (Symbol(ErrorHandlingMiddleware.name));
    
    async process(ctx: Context, next: NextMiddleware): Promise<void> {
        try {
            await next();
        }
        catch(error) {            
            const errorResult = ctx.config.errorHandler(error);
            errorResult?.executeResult(ctx.output);            
        }
    }
}