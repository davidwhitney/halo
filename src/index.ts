import { Activator } from './typeActivation/Activator';
import { RouteTable } from './routing/RouteTable';
import { RequestPipeline } from "./requestHandling/RequestPipeline";
import { IHttpAdapter } from './adapters/IHttpAdapter';
import createHttpAdapter from "./adapters/HttpAdapterFactory";
import { ErrorHandler } from './types';
import { DeveloperPageErrorHandler } from './requestHandling/errors/DeveloperPageErrorHandler';

export class Application {
    private activator: Activator;
    private httpHost: IHttpAdapter;
    private router: RouteTable;
    private errorHandler: ErrorHandler;

    constructor(router: RouteTable) {
        this.errorHandler = DeveloperPageErrorHandler;
        this.httpHost = createHttpAdapter();
        this.activator = new Activator();
        this.router = router || new RouteTable();
    }

    public listen(port: number) {
        this.httpHost.listen(port, async (output) => {
            const pipeline = new RequestPipeline(this.router, this.activator, this.errorHandler);
            await pipeline.processRequest(output);
        });
    }
}


