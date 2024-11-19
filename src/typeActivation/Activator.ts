import { FunctionWrappingRouteHandler } from './FunctionWrappingRouteHandler';
import { ServerSideComponentRouteHandler } from './ServerSideComponentRouteHandler';
import { RouteHandler, RouteRegistration } from '../types';

export class Activator {
    public createInstance(registration: RouteRegistration): RouteHandler {
        // TODO: Do DI for constructors here.

        const { handler } = registration;
        const unknownHandler = handler as any;

        switch (registration.type) {
            case "constructor":
                return new unknownHandler() as RouteHandler;
            case "function":
                return new FunctionWrappingRouteHandler(unknownHandler);
            case "jsx-element":
                return new ServerSideComponentRouteHandler(unknownHandler);
            case "handler-instance":
                return handler as RouteHandler;
            default:
                throw new Error(`Unknown handler type: ${registration.type}`);
        }
    }
}
