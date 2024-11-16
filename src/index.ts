import { Activator } from './typeActivation/Activator';
import { RouteTable } from './routing/RouteTable';
import { RouteHandlerMiddlware as RouteHandlerMiddlware } from "./requestHandling/RouteHandlerMiddlerware";
import { DeveloperPageErrorHandler } from './requestHandling/errors/DeveloperPageErrorHandler';
import { Context } from './requestHandling/Context';
import { Configuration } from './Configuration';
import { LoggingMiddleware } from './requestHandling/middleware/LoggingMiddleware';
import createMiddlewareChain from './requestHandling/middleware/createMiddlewareChain';
import createHttpAdapter from "./adapters/HttpAdapterFactory";

export class Application {
    public configuration: Configuration;

    constructor(configuration: Partial<Configuration>) {
        this.configuration = {
            errorHandler: DeveloperPageErrorHandler,
            httpHost: createHttpAdapter(),
            activator: new Activator(),
            router: new RouteTable(),
            middleware: [
                LoggingMiddleware,
                RouteHandlerMiddlware
            ]
        }

        this.configuration = { ...this.configuration, ...configuration };
    }

    public listen(port: number) {
        this.configuration.httpHost.listen(port, async (output) => {
            const ctx: Context = { 
                output: output, 
                config: this.configuration 
            };

            const { middleware, nextFunc } = createMiddlewareChain(this.configuration, ctx);
            await middleware.process(ctx, nextFunc!);

        });
    }
}
