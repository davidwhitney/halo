import { HostingRequest, IOutputChannel, OnRequestCallback } from './IOutputChannel';

export default class DenoHttpAdapter {
    public listen(port: number, onRequest: OnRequestCallback) {

        Deno.serve((req) => {
            console.log('Incoming request:', req.url);
            const channel = new DenoOutputChannel(req);
            onRequest(channel);

            return new Response(channel.response.body);
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

    constructor(request: any) {
        this.request = {
            url: request.url!,
            method: request.method!,
            headers: request.headers! as Record<string, string | string[]>
        };

        this.response = {
            statusCode: 200,
            headers: {},
            body: ''
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
