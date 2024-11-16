import { Logger } from '../observability/Logger';
import { IHttpAdapter } from './IHttpAdapter';
import { HostingRequest, IOutputChannel, OnRequestCallback } from './IOutputChannel';

declare const Deno: any;

export default class DenoHttpAdapter implements IHttpAdapter {
    public listen(port: number, onRequest: OnRequestCallback) {
        Deno.serve({ port },
            async (req: any) => {
                Logger.log(`Request: ${req.method} ${req.url}`);
                    
                const channel = new DenoOutputChannel(req);
                await onRequest(channel);

                return new Response(channel.response.body, {
                    status: channel.response.statusCode,
                    headers: channel.response.headers
                });
        });
    }
}

export class DenoOutputChannel implements IOutputChannel {
    public request: HostingRequest;
    public response: {
        statusCode: number;
        headers: Record<string, string>;
        body: any;
    };

    public awaitable: Promise<void> = new Promise(() => {});

    constructor(request: any) {
        this.request = {
            url: request.url!,
            method: request.method!,
            headers: request.headers! as Record<string, string | string[]>
        };

        this.response = {
            statusCode: 500,
            headers: {},
            body: "Internal Server Error"
        };
    }

    public writeHeaders(statusCode: number, headers: Record<string, string>) {
        this.response.statusCode = statusCode;
        this.response.headers = headers;
    }

    public writeBody(body: any) {
        this.response.body = body;
    }

    public end() {
    }
}
