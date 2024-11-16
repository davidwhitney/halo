import { Configuration } from "../../Configuration";
import { Context } from "../Context";
import { MiddlewareChainItem } from "./Middleware";

export default function(config: Configuration, ctx: Context) {
    const middlewareCfg = config.middleware;
    const middlewarePipeline: MiddlewareChainItem[] = middlewareCfg.map(mw => {
        return { middleware: new mw(), nextFunc: null };
    });

    // Create next function entries
    for (let i = 0; i < middlewarePipeline.length; i++) {
        const entry = middlewarePipeline[i];           

        entry.nextFunc = async () => {                    
            const next = middlewarePipeline[i + 1];
            const nextMiddleware = next?.middleware;
            const nextContinuation = next?.nextFunc;

            if (!nextMiddleware) {
                return;
            }

            await nextMiddleware.process(ctx, nextContinuation!);
        }
    }

    return middlewarePipeline[0];
}