import { RequestMetadata, RouteHandler, RouteRegistration } from "../types";

export class RouteTable {
    public entries: Map<string, RouteHandler> = new Map();

    public get(path: string, handler: RouteHandler) {
        this.entries.set(path, handler);
    }

    public match(metadata: RequestMetadata): RouteRegistration | undefined {
        // TODO: handle wildcards w/ regex
        console.log(metadata);

        const urlObj = new URL(metadata.url);

        const handler = this.entries.get(urlObj.pathname);
        return handler ? { specifier: urlObj.pathname, handler } : undefined;
    }
}
