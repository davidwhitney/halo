import * as React from 'react';
import { Logger } from '../observability/Logger';
import { FunctionWrappingRouteHandler } from './FunctionWrappingRouteHandler';
import { ServerSideComponentRouteHandler } from './ServerSideComponentRouteHandler';
import { RouteHandler, RouteHandlerClass, RouteHandlerConstructor, RouteHandlerFunction, RouteRegistration } from '../types';

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
