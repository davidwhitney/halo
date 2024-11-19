import React from 'react';
import { describe, it, expect, beforeAll } from 'vitest';
import { Context } from './requestHandling/Context';
import { Client, serve } from './testing/httpHelpers';
import { RouteTable } from './routing/RouteTable';
import { empty, json, redirect, stringResult } from './requestHandling/results';

describe("Application routing - React support", () => {
    let client: Client;
    beforeAll(() => {
        client = serve((r: RouteTable) => r
        .get('/object-result', async (ctx: Context) => { return { foo: "world" };})
        .get('/json-result', async (ctx: Context) => { return json({ foo: "world" });})
        .get('/string-result', async (ctx: Context) => { return stringResult('hello world'); })
        .get('/redirect-result', async (ctx: Context) => { return redirect('/helloworld'); })
        .get('/empty-result', async (ctx: Context) => { return empty(); })
        );
    });
    
    it("can get object result", async () => {
        const text = await client.reqJson("/object-result");
        expect(text).toStrictEqual({ foo: "world" });
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
});
