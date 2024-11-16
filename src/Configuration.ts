import { IHttpAdapter } from './adapters/IHttpAdapter';
import { RouteTable } from './routing/RouteTable';
import { Activator } from './typeActivation/Activator';
import { ErrorHandler } from './types';


export interface Configuration {
    errorHandler: ErrorHandler;
    httpHost: IHttpAdapter;
    activator: Activator;
    router: RouteTable;
    middleware: any[];
}
