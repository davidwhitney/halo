import * as http from 'node:http';

export type OnRequestCallback = (req: http.IncomingMessage, res: http.ServerResponse) => void;

export default class NodeHttpAdapter {
    public listen(port: number, onRequest: OnRequestCallback) {
        const server = http.createServer(async (req, res) => {
            onRequest(req, res);
        });

        server.listen(port, () => {
            console.log('Listening on: http://localhost:' + port);
        });
    }
    
}
