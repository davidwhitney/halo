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
        const urlObj = new URL(metadata.url);
    
        for (const [key, value] of this.entries) {
            const [verb, specifier] = key.split('::');
    
            if (verb !== metadata.method) {
                continue;
            }
    
            // Exact match
            if (specifier === urlObj.pathname) {
                return value;
            }
    
            // Convert route pattern to regex
            const regexPattern = specifier
                .replace(/\//g, '\\/') // Escape forward slashes
                .replace(/\*/g, '.*')  // Handle wildcards first - match any characters including /
                .replace(/\{([^:}]+)(?::([^}]+))?\}/g, (_, name, pattern) => {
                    return `(?<${name}>${pattern || '[^/]+'})`; 
                });
    
            try {
                const regex = new RegExp(`^${regexPattern}$`);
                const match = urlObj.pathname.match(regex);
    
                if (match) {
                    return {
                        ...value,
                        params: match.groups || {}
                    };
                }
            } catch (err) {
                console.warn(`Invalid regex pattern for route: ${specifier}`);
            }
        }
    
        return undefined;
    }
}
