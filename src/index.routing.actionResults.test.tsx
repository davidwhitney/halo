import { describe, it, expect, beforeAll } from 'vitest';
import { Context } from './requestHandling/Context';
import { Client, serve } from './testing/httpHelpers';
import { RouteTable } from './routing/RouteTable';
import { content, empty, json, notFound, redirect, stringResult } from './requestHandling/results';
import { statusCode } from './requestHandling/results/StatusCodeResult';
import { xml } from './requestHandling/results/XmlResult';

describe("Application routing - Action Results", () => {
    let client: Client;
    beforeAll(() => {
        client = serve((r: RouteTable) => r
        .get('/object-result', async (ctx: Context) => { return { foo: "world" };})
        .get('/json-result', async (ctx: Context) => { return json({ foo: "world" });})
        .get('/string-result', async (ctx: Context) => { return stringResult('hello world'); })
        .get('/redirect-result', async (ctx: Context) => { return redirect('/helloworld'); })
        .get('/empty-result', async (ctx: Context) => { return empty(); })
        .get('/not-found-result', async (ctx: Context) => { return notFound(); })
        .get('/status-302', async (ctx: Context) => { return statusCode(302); })
        .get('/content-type', async (ctx: Context) => { return content(`{ "foo": 123 }`, 'text/json+something'); })
        .get('/xml-result', async (ctx: Context) => { return xml({ foo: "bar"}); })
        );
    });
    
    it("can get object result", async () => {
        const text = await client.reqJson("/object-result");
        expect(text).toStrictEqual({ foo: "world" });
    });

    it("can get object result - content negotiates with accept header for json", async () => {
        const text = await client.req("/object-result", "GET", { headers: { Accept: "application/json" } });
        const body = await text.json();
        expect(body).toStrictEqual({ foo: "world" });
    });

    it("can get object result - content negotiates with accept header for xml", async () => {
        const text = await client.req("/object-result", "GET", { headers: { Accept: "application/xml" } });
        const body = await text.text();
        expect(body).toStrictEqual("<foo>world</foo>");
    });

    it("can get json object result", async () => {
        const text = await client.reqJson("/json-result");
        expect(text).toStrictEqual({ foo: "world" });
    });

    it("can get string result", async () => {
        const text = await client.reqText("/string-result");
        expect(text).toStrictEqual("hello world");
    });

    it("can get redirect result", async () => {
        const response = await client.req("/redirect-result", "GET", { redirect: "manual" });
        expect(response.status).toBe(302);
        expect(response.headers.get('Location')).toBe("/helloworld");
    });

    it("can get nothing result", async () => {
        const response = await client.req("/empty-result");
        expect(response.status).toBe(204);
    });

    it("can get not found result", async () => {
        const response = await client.req("/not-found-result");
        expect(response.status).toBe(404);
    });

    it("can get status result", async () => {
        const response = await client.req("/status-302");
        expect(response.status).toBe(302);
    });

    it("can get content result", async () => {
        const response = await client.req("/content-type");
        const body = await response.json();

        expect(body.foo).toBe(123);
        expect(response.headers.get('Content-Type')).toBe('text/json+something');
    });

    it("can get xml object result", async () => {
        const text = await client.reqText("/xml-result");
        expect(text).toStrictEqual("<foo>bar</foo>");
    });
});
