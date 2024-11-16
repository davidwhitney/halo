import { RequestMetadata, IHandleRoutes, RouteRegistration } from "../types";

export class RouteTable {
    public entries: Map<string, IHandleRoutes> = new Map();

    public get(path: string, handler: IHandleRoutes) {
        this.entries.set(path, handler);
    }

    public match(metadata: RequestMetadata): RouteRegistration | undefined {
        // TODO: handle wildcards w/ regex
        const urlObj = new URL(metadata.url);

        const handler = this.entries.get(urlObj.pathname);
        return handler ? { specifier: urlObj.pathname, handler } : undefined;
    }
}
