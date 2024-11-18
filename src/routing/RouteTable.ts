import { RequestMetadata, IHandleRoutes, RouteRegistration } from "../types";
import detectHandlerType from './detectHandlerType';

export class RouteTable {
    public entries: Map<string, RouteRegistration> = new Map();

    public get(path: string, handler: IHandleRoutes) {
        this.add({ specifier: path, verb: 'GET', handler });
        return this;
    }

    public post(path: string, handler: IHandleRoutes) {
        this.add({ specifier: path, verb: 'POST', handler });
        return this;
    }

    public put(path: string, handler: IHandleRoutes) {
        this.add({ specifier: path, verb: 'PUT', handler });
        return this;
    }

    public delete(path: string, handler: IHandleRoutes) {
        this.add({ specifier: path, verb: 'DELETE', handler });
        return this;
    }

    public patch(path: string, handler: IHandleRoutes) {
        this.add({ specifier: path, verb: 'PATCH', handler });
        return this;
    }

    public head(path: string, handler: IHandleRoutes) {
        this.add({ specifier: path, verb: 'HEAD', handler });
        return this;
    }

    public add(routeRegistration: RouteRegistration) {
        routeRegistration.type = detectHandlerType(routeRegistration.handler);
        const key = `${routeRegistration.verb}::${routeRegistration.specifier}`;
        this.entries.set(key, routeRegistration);
    }

    public match(metadata: RequestMetadata): RouteRegistration | undefined {
        // TODO: handle wildcards w/ regex
        const urlObj = new URL(metadata.url);

        for (const [key, value] of this.entries) {
            const [verb, specifier] = key.split('::');

            if (verb !== metadata.method) {
                continue;
            }

            // match exact
            if (specifier === urlObj.pathname) {
                return value;
            }
            
            // match wildcards
            const parts = specifier.split('/');
            const urlParts = urlObj.pathname.split('/');
            if (parts.length !== urlParts.length) {
                continue;
            }

            let match = true;
            for (let i = 0; i < parts.length; i++) {
                if (parts[i] === '*') {
                    continue;
                }

                if (parts[i] !== urlParts[i]) {
                    match = false;
                    break;
                }
            }

            if (match) {
                return value;
            }

        }

        const key = `${metadata.method}::${urlObj.pathname}`;
        return this.entries.get(key);
    }
}
