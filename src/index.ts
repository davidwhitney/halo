import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import NodeHttpAdapter from "./adapters/NodeHttpAdapter";
import { IOutputChannel } from "./adapters/IOutputChannel";

export type RouteHandlerClass = { handle(ctx: Context): Promise<any>; }
export type RouteHandlerConstructor = { new (): RouteHandlerClass; }
export type RouteHandlerFunction = (ctx: Context) => Promise<any>;
export type RouteHandler = RouteHandlerClass | RouteHandlerFunction | RouteHandlerConstructor | JSX.Element;
export interface RouteRegistration { specifier: string; handler: RouteHandler; }

export type RequestMetadata = { url: string, method: string, headers: Record<string, string | string[]> };

class Logger {
    static info(message: string, ...args: any[]) {
        console.log(message, ...args);
    }

    static error(message: string, ...args: any[]) {
        console.error(message, ...args);
    }

    static warn(message: string, ...args: any[]) {
        console.warn(message, ...args);
    }

    static debug(message: string, ...args: any[]) {
        console.debug(message, ...args);
    }

    static trace(message: string, ...args: any[]) {
        console.trace(message, ...args);
    }

    static log(message: string, ...args: any[]) {
        console.log(message, ...args);
    }
}

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

    public match(metadata: RequestMetadata): RouteRegistration | undefined {
        // TODO: handle wildcards w/ regex
        const { url } = metadata;
        const handler = this.entries.get(url);
        return handler ? { specifier: url, handler } : undefined;
    }
}

export class Activator {
    public createInstance(registration: RouteRegistration): RouteHandlerClass {
        const { handler } = registration;

        // TODO: do this properly with type guards
        // TODO: DI for constructor injection

        let instance: RouteHandlerClass;
        if (typeof handler === 'function') {
            if (handler.prototype && handler.prototype.handle && this.isConstuctorFunction(handler)) {
                // It's a class constructor
                instance = new handler() as RouteHandlerClass;
            } else {
                // It's a regular function handler
                instance = new FunctionWrappingRouteHandler(handler as RouteHandlerFunction) as RouteHandlerClass;
            }
        } else if (React.isValidElement(handler)) {
            // It's a JSX element
            instance = new ServerSideComponentRouteHandler(handler) as RouteHandlerClass;
        } else {
            // Handler is already an instance
            instance = handler as RouteHandlerClass;
        }

        Logger.info('Created instance:', instance);

        return instance;
    }

    private isConstuctorFunction(handler: RouteHandler): handler is RouteHandlerConstructor {
        return typeof handler === 'function';
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
        this.httpHost.listen(port, (output) => {
            const pipeline = new RequestPipeline(this.router, this.activator);
            pipeline.processRequest(output);
        });        
    }
}

interface IActionResult {
    executeResult(output: IOutputChannel): void;
}

class JsonResult implements IActionResult {
    constructor(private data: any, private statusCode = 200) {}

    public executeResult(output: IOutputChannel) {
        output.writeHeaders(this.statusCode, { 'Content-Type': 'application/json' });
        output.writeBody(JSON.stringify(this.data));
        output.end();
    }
}

class ComponentResult implements IActionResult {
    constructor(private component: any, private props: any) {}

    public executeResult(output: IOutputChannel) {
        const html = ReactDOMServer.renderToString(this.component);
        output.writeHeaders(200, { 'Content-Type': 'text/html' });
        output.writeBody(html);
        output.end();
    }
}

export class RequestPipeline {
    constructor(private router: RouteTable, private activator: Activator) {}
    
    public async processRequest(output: IOutputChannel) {
        try {
            
            // Look up handler
            const handler = this.router.match(output.request);
            if (!handler) {
                output.writeHeaders(404, {});
                output.writeBody('Not Found');
                output.end();
                return;
            }

            const ctx = new Context();
            const handlerInstance = this.activator.createInstance(handler);
            const result = await handlerInstance.handle(ctx);

            if ((result as IActionResult).executeResult) {
                (result as IActionResult).executeResult(output);
            } else {
                new JsonResult(result).executeResult(output);
            }
    
        } catch (error) {
            Logger.error("Pipeline error", error);
            new JsonResult({ error: 'Internal Server Error' }, 500).executeResult(output);
        }
    }
}
