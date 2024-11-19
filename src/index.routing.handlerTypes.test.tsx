import { stringResult } from "./requestHandling/results";
import { RouteHandler } from "./types";
import { beforeAll, describe, it, expect } from 'vitest';
import { Context } from './requestHandling/Context';
import { serve, Client } from './testing/httpHelpers';
import { RouteTable } from './routing/RouteTable';

class NamedHandler implements RouteHandler {
    public async handle(ctx: Context) {
        return stringResult('hello');
    }
}

const namedHandlerInstance = new NamedHandler();

describe("Application covering tests", () => {    
    let client: Client;
    beforeAll(() => {
        client = serve((r: RouteTable) => r
        .get('/', class Handler implements RouteHandler {
            public async handle(ctx: Context) {
                return stringResult('hello');
            }
        })
        .get('/handler-instance', namedHandlerInstance)
        .get('/function-callback', async (ctx: Context) => { return stringResult('hello world'); })
        .get('/error', async (ctx: Context) => { throw new Error('oops'); })
        );
    });

    it("can get basic handler request", async () => {
        const text = await client.reqText("/");
        expect(text).toBe("hello");
    });

    it("can get handler instance request", async () => {
        const text = await client.reqText("/handler-instance");
        expect(text).toBe("hello");
    });

    it("can get 404 on not found", async () => {
        const text = await client.req("/not-found-here");
        expect(text.status).toBe(404);
    });

    it("can get basic function-callback request", async () => {
        const text = await client.reqText("/function-callback");
        expect(text).toBe("hello world");
    });

    it("can get error page", async () => {
        const text = await client.reqText("/error");
        expect(text).toContain("Error: oops");
    });
});
