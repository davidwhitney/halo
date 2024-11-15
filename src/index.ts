import { IncomingMessage, ServerResponse } from "http";
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import NodeHttpAdapter from "./adapters/NodeHttpAdapter";

export type RouteHandlerClass = { handle(ctx: Context): Promise<any>; }
export type RouteHandlerConstructor = { new (): RouteHandlerClass; }
export type RouteHandlerFunction = (ctx: Context) => Promise<any>;
export type RouteHandler = RouteHandlerClass | RouteHandlerFunction | RouteHandlerConstructor | JSX.Element;
export interface RouteRegistration { specifier: string; handler: RouteHandler; }

class FunctionWrappingRouteHandler implements RouteHandlerClass {
    constructor(private handler: RouteHandlerFunction) {}
    public async handle(ctx: Context) {
        return this.handler(ctx);
    }
}

class ServerSideComponentRouteHandler implements RouteHandlerClass {
    constructor(private component: JSX.Element) {}
    public async handle(ctx: Context) {
        return new ComponentResult(this.component, null);
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

        let instance: RouteHandler;
        if (typeof handler === 'function') {
            if (handler.prototype && handler.prototype.handle) {
                // It's a class constructor
                instance = new handler();
            } else {
                // It's a regular function handler
                instance = new FunctionWrappingRouteHandler(handler);
            }
        } else if (React.isValidElement(handler)) {
            // It's a JSX element
            instance = new ServerSideComponentRouteHandler(handler);
        } else {
            // Handler is already an instance
            instance = handler;
        }

        console.info('Created instance:', instance);

        return instance;
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

interface IActionResult {
    executeResult(res: ServerResponse<IncomingMessage>): void;
}

class JsonResult implements IActionResult {
    constructor(private data: any, private statusCode = 200) {}

    public executeResult(res: ServerResponse<IncomingMessage>) {
        res.writeHead(this.statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.data));
    }
}

class ComponentResult implements IActionResult {
    constructor(private component: any, private props: any) {}

    public executeResult(res: ServerResponse<IncomingMessage>) {
        const html = ReactDOMServer.renderToString(this.component);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);        
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
            const result = await handlerInstance.handle(ctx);

            if ((result as IActionResult).executeResult) {
                (result as IActionResult).executeResult(res);
            } else {
                new JsonResult(result).executeResult(res);
            }
    
        } catch (error) {
            console.error(error);
            new JsonResult({ error: 'Internal Server Error' }, 500).executeResult(res);
        }
    }
}
