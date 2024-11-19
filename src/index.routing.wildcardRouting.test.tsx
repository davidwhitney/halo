import { stringResult } from "./requestHandling/results";
import { describe, it, expect, beforeAll } from 'vitest';
import { Context } from './requestHandling/Context';
import { Client, serve } from './testing/httpHelpers';
import { RouteTable } from './routing/RouteTable';

describe("Application routing - wildcard routing", () => {        
    let client: Client;
    beforeAll(() => {
        client = serve((r: RouteTable) => r
        .get('/with-wildcard/{value:*}', async ({ params }: Context) => { return stringResult(params.value); })
        .get('/with-wildcard-no-capture/*', async ({ params }: Context) => { return stringResult(params.value); })
        .get('/with-wildcard-in-middle/*/foo', async ({ params }: Context) => { return stringResult('foo'); })
        .get('/with-params/{id:[A-Za-z]+}', async ({ params }: Context) => { return stringResult(params.id); })
        .get('/with-params2/{id:[A-Za-z]+}/{rest:*}', async ({ params }: Context) => { return stringResult(params.rest); })
        );
    });
    
    it("can use wildcard route", async () => {
        const randomValue = Math.random().toString();
        const text = await client.reqText("/with-wildcard/" + randomValue);
        expect(text).toBe(randomValue);
    });

    it("can use wildcard route without data capture", async () => {
        const randomValue = Math.random().toString();
        const text = await client.reqText("/with-wildcard-no-capture/" + randomValue);
        expect(text).toBe('');
    });

    it("can use wildcard route in the middle of a path", async () => {
        const text = await client.reqText("/with-wildcard-in-middle/bah/foo");
        expect(text).toBe('foo');
    });

    it("can use regex params route", async () => {
        const randomStringValueOfAz = Math.random().toString(36).replace(/[^a-z]+/g, '');
        const text = await client.reqText("/with-params/" + randomStringValueOfAz);
        expect(text).toBe(randomStringValueOfAz);
    });

    it("can use multiple regex params route", async () => {
        const randomStringValueOfAz = Math.random().toString(36).replace(/[^a-z]+/g, '');
        const text = await client.reqText(`/with-params2/${randomStringValueOfAz}/foo`);
        expect(text).toBe('foo');
    });

    it("regex params route - non-compliant match - 404s", async () => {
        const randomValue = Math.random().toString();
        const response = await client.req("/with-params/" + randomValue);
        expect(response.status).toBe(404);
    });
});
