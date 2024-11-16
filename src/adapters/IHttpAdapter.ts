import { OnRequestCallback } from './IOutputChannel';

export interface IHttpAdapter {
    listen(port: number, onRequest: OnRequestCallback): void;
}
