import NodeHttpAdapter from "./adapters/NodeHttpAdapter";

export type RouteHandlerClass = { handle(ctx: Context): Promise<any>; }
export type RouteHandlerConstructor = { new (): RouteHandlerClass; }
export type RouteHandlerFunction = (ctx: Context) => Promise<any>;
export type RouteHandler = RouteHandlerClass | RouteHandlerFunction | RouteHandlerConstructor;
export interface RouteRegistration { specifier: string; handler: RouteHandler; }

class FunctionWrappingRouteHandler implements RouteHandlerClass {
    constructor(private handler: RouteHandlerFunction) {}
    public async handle(ctx: Context) {
        return this.handler(ctx);
    }
}

export class RouteTable {
    public entries: Map<string, RouteHandler> = new Map();

    public get(path: string, handler: RouteHandler) {
        this.entries.set(path, handler);
    }

    public match(path: string): RouteRegistration | undefined {
        // TODO: handle wildcards w/ regex

        const handler = this.entries.get(path);
        return handler ? { specifier: path, handler } : undefined;
    }
}

export class Activator {
    public createInstance(registration: RouteRegistration) {
        const { handler } = registration;

        // TODO: do this properly with type guards
        // TODO: DI for constructor injection

        if (typeof handler === 'function') {
            if (handler.prototype && handler.prototype.handle) {
                // It's a class constructor
                return new handler();
            } else {
                // It's a regular function handler
                return new FunctionWrappingRouteHandler(handler);
            }
        } else {
            // Handler is already an instance
            return handler;
        }
    }
}

export class Context {

}

export class Application {
    private activator: Activator;
    private httpHost: NodeHttpAdapter;
    private router: RouteTable;

    constructor(router: RouteTable) {
        this.activator = new Activator();
        this.httpHost = new NodeHttpAdapter();
        this.router = router || new RouteTable();
    }

    public listen(port: number) {
        this.httpHost.listen(port, (req, res) => {
            this.processRequest(req, res);
        });        
    }

    private async processRequest(req: any, res: any) {
        const pipeline = new RequestPipeline(this.router, this.activator);
        pipeline.processRequest(req, res);
    }
}

export class RequestPipeline {
    constructor(private router: RouteTable, private activator: Activator) {}
    
    public async processRequest(req: any, res: any) {
        try {
            // Get path from request URL
            const path = req.url || '/';
            
            // Look up handler
            const handler = this.router.match(path);
            if (!handler) {
                res.writeHead(404);
                res.end('Not Found');
                return;
            }

            const ctx = new Context();
            const handlerInstance = this.activator.createInstance(handler);
            const result = handlerInstance.handle(ctx);

            // Send response
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
    
        } catch (error) {
            console.error(error);
            // Handle errors
            res.writeHead(500);
            res.end('Internal Server Error' + JSON.stringify(error));
        }
    }
}



