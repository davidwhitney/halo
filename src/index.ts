import { Activator } from './typeActivation/Activator';
import { RouteTable } from './routing/RouteTable';
import { RequestPipeline } from "./requestHandling/RequestPipeline";
import { IHttpAdapter } from './adapters/IHttpAdapter';
import createHttpAdapter from "./adapters/HttpAdapterFactory";
import { ErrorHandler } from './types';
import { DeveloperPageErrorHandler } from './requestHandling/errors/DeveloperPageErrorHandler';

export interface Configuration {
    errorHandler: ErrorHandler,
    httpHost: IHttpAdapter,
    activator: Activator,
    router: RouteTable    
}

export class Application {
    public configuration: Configuration;

    constructor(configuration: Partial<Configuration>) {
        this.configuration = {
            errorHandler: DeveloperPageErrorHandler,
            httpHost: createHttpAdapter(),
            activator: new Activator(),
            router: new RouteTable()
        }

        this.configuration = { ...this.configuration, ...configuration };
    }

    public listen(port: number) {
        this.configuration.httpHost.listen(port, async (output) => {
            const pipeline = new RequestPipeline(
                this.configuration.router, 
                this.configuration.activator, 
                this.configuration.errorHandler
            );

            await pipeline.processRequest(output);
        });
    }
}
