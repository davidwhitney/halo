import { Configuration } from "../../Configuration";
import { Logger } from "../../observability/Logger";
import { Context } from "../Context";
import { MiddlewareChainItem } from "./Middleware";

export default function(config: Configuration, ctx: Context) {
    const middlewareCfg = config.middleware;
    const pipeline = middlewareCfg
        .map(mw => ({ middleware: new mw(), nextFunc: null }) as MiddlewareChainItem);

    // Create next function entries
    for (let i = 0; i < pipeline.length; i++) {
        const entry = pipeline[i];           

        entry.nextFunc = async () => {                    
            const next = pipeline[i + 1];
            const nextMiddleware = next?.middleware;
            const nextContinuation = next?.nextFunc;

            if (!nextMiddleware) {
                return;
            }

            Logger.debug("Running", nextMiddleware.name.description);
            
            await nextMiddleware.process(ctx, nextContinuation!);

            Logger.debug("Finished", nextMiddleware.name.description);
        }
    }

    return pipeline[0];
}