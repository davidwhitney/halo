import * as http from 'node:http';
import { HostingRequest, IOutputChannel, OnRequestCallback } from './IOutputChannel';

export default class NodeHttpAdapter {
    public listen(port: number, onRequest: OnRequestCallback) {
        const server = http.createServer(async (req, res) => {
            const channel = new NodeOutputChannel(req, res);
            onRequest(channel);
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
