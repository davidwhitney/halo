import { RequestMetadata, RouteHandler, RouteRegistration } from "../types";

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
