import * as http from 'node:http';
import { HostingRequest, IOutputChannel, OnRequestCallback } from './IOutputChannel';
import { IHttpAdapter } from './IHttpAdapter';
import { Logger } from '../observability/Logger';

export default class NodeHttpAdapter implements IHttpAdapter {
    public listen(port: number, onRequest: OnRequestCallback) {
        const server = http.createServer(async (req, res) => {
            Logger.log(`Request: ${req.method} ${req.url}`);

            const channel = new NodeOutputChannel(req, res);
            await onRequest(channel);
        });

        server.listen(port, () => {
            console.log('Listening on: http://localhost:' + port);
        });
    }
}

export class NodeOutputChannel implements IOutputChannel {
    public request: HostingRequest;

    constructor(request: http.IncomingMessage, private response: http.ServerResponse) {
        this.request = {
            url: request.url!,
            method: request.method!,
            headers: request.headers! as Record<string, string | string[]>
        };

        if (this.request.url.startsWith("/")) {
            this.request.url = "http://localhost" + this.request.url;
        }
    }

    public writeHeaders(statusCode: number, headers: Record<string, string>) {
        this.response.writeHead(statusCode, headers);
    }

    public writeBody(body: any) {
        this.response.write(body);
    }

    public end() {
        this.response.end();
    }
}
