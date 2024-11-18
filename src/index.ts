import { Activator } from './typeActivation/Activator';
import { RouteTable } from './routing/RouteTable';
import { RouterMiddleware as RouterMiddleware } from "./requestHandling/middleware/RouterMiddleware";
import { DeveloperPageErrorHandler } from './requestHandling/errors/DeveloperPageErrorHandler';
import { Context } from './requestHandling/Context';
import { Configuration } from './Configuration';
import { LoggingMiddleware } from './requestHandling/middleware/LoggingMiddleware';
import { ErrorHandlingMiddleware } from './requestHandling/middleware/ErrorHandlingMiddleware';
import createMiddlewareChain from './requestHandling/middleware/createMiddlewareChain';
import createHttpAdapter from "./adapters/HttpAdapterFactory";
import { Logger } from './observability/Logger';
import { IOutputChannel } from './adapters/IOutputChannel';

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
                ErrorHandlingMiddleware
            ]
        };

        this.configuration = { ...this.configuration, ...configuration };

        // If this isn't the end of the chain the whole framework doesn't execute!
        this.configuration.middleware.push(RouterMiddleware);
    }

    public listen(port: number) {
        this.configuration.httpHost.listen(port, async (output) => {
            await this.processRequest(output);
        });
    }

    public async processRequest(output: IOutputChannel) {
        const ctx: Context = { 
            request: output.request,
            output: output, 
            config: this.configuration,
            params: {}
        };

        const { middleware, nextFunc } = createMiddlewareChain(this.configuration, ctx);

        Logger.debug("Running", middleware.name.description);

        await middleware.process(ctx, nextFunc!);

        Logger.debug("Finished", middleware.name.description);
    }
}
