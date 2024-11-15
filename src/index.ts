import NodeHttpListener from "./listeners/NodeHttpListener";

export type RouteHandlerClass = {
    handle(ctx: Context): Promise<any>;
}

export type RouteHandlerConstructor = {
    new (): RouteHandlerClass;
}

export type RouteHandlerFunction = (ctx: Context) => Promise<any>;

export type RouteHandler = RouteHandlerClass | RouteHandlerFunction | RouteHandlerConstructor;

export class RouteTable {
    public entries: Map<string, RouteHandler> = new Map();

    public get(path: string, handler: RouteHandler) {
        this.entries.set(path, handler);
    }
}

export class Context {

}

export class Application {
    private httpHost: NodeHttpListener;
    private router: RouteTable;

    constructor(router: RouteTable) {
        this.httpHost = new NodeHttpListener();
        this.router = router || new RouteTable();
    }

    public listen(port: number) {
        this.httpHost.listen(port, (req, res) => {
            this.processRequest(req, res);
        });        
    }

    private async processRequest(req: any, res: any) {
        try {
            // Get path from request URL
            const path = req.url || '/';
            
            // Look up handler
            const handler = this.router.entries.get(path);
            if (!handler) {
                res.writeHead(404);
                res.end('Not Found');
                return;
            }
    
            // Create context
            const ctx = new Context();
    
            // Execute handler based on type
            let result;
            
            if (typeof handler === 'function') {
                if (handler.prototype && handler.prototype.handle) {
                    // It's a class constructor
                    const instance = new handler();
                    result = await instance.handle(ctx);
                } else {
                    // It's a regular function handler
                    result = await handler(ctx);
                }
            } else {
                // Handler is already an instance
                result = await handler.handle(ctx);
            }

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



