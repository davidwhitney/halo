import NodeHttpAdapter from "./adapters/NodeHttpAdapter";
import { Activator } from './typeActivation/Activator';
import { RouteTable } from './routing/RouteTable';
import { RequestPipeline } from "./requestHandling/RequestPipeline";
import createHttpAdapter from "./adapters/HttpAdapterFactory";

export class Application {
    private activator: Activator;
    private httpHost: NodeHttpAdapter;
    private router: RouteTable;

    constructor(router: RouteTable) {
        this.httpHost = createHttpAdapter();
        this.activator = new Activator();
        this.router = router || new RouteTable();
    }

    public listen(port: number) {
        this.httpHost.listen(port, (output) => {
            const pipeline = new RequestPipeline(this.router, this.activator);
            pipeline.processRequest(output);
        });        
    }
}


