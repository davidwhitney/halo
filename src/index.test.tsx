import React from 'react';
import { Context } from "vm";
import { Application } from ".";
import { stringResult, redirect, empty } from "./requestHandling/results";
import { RouteHandler } from "./types";
import { beforeAll, describe, it, expect } from 'vitest';

describe("Application", () => {    
    let sut: Application;
    beforeAll(() => {
        sut = getTestApp();
        sut.listen(5000);
    });

    it("can get basic handler request", async () => {
        const text = await reqText("/");
        expect(text).toBe("hello");
    });

    it("can get basic function-callback request", async () => {
        const text = await reqText("/function-callback");
        expect(text).toBe("hello world");
    });

    it("can get object result", async () => {
        const text = await reqJson("/object-result");
        expect(text).toStrictEqual({ foo: "world" });
    });

    it("can get redirect result", async () => {
        const response = await req("/redirect", "GET", { redirect: "manual" });
        expect(response.status).toBe(302);
        expect(response.headers.get('Location')).toBe("/helloworld");
    });

    it("can get nothing result", async () => {
        const response = await req("/nothing");
        expect(response.status).toBe(204);
    });

    it("can use wildcard route", async () => {
        const randomValue = Math.random().toString();
        const text = await reqText("/with-wildcard/" + randomValue);
        expect(text).toBe(randomValue);
    });

    it("can use regex params route", async () => {
        const randomStringValueOfAz = Math.random().toString(36).replace(/[^a-z]+/g, '');
        const text = await reqText("/with-params/" + randomStringValueOfAz);
        expect(text).toBe(randomStringValueOfAz);
    });

    it("can get error page", async () => {
        const text = await reqText("/error");
        expect(text).toContain("Error: oops");
    });

    it("can get react component rendered server side", async () => {
        const text = await reqText("/react");
        expect(text).toContain("<div>Hello World!!!</div>");
    });

    it("can get react component rendered server side when passed as a function", async () => {
        const text = await reqText("/react2");
        expect(text).toContain("<div>Hello World!!!</div>");
    });
});

async function req(url: string, method: string = "GET", opts: RequestInit = {}) {
    return await fetch(`http://localhost:5000${url}`, { method, ...opts });
}

async function reqText(url: string, method: string = "GET") {
    const result = await fetch(`http://localhost:5000${url}`, { method });  
    return await result.text();
}

async function reqJson(url: string, method: string = "GET") {
    const result = await fetch(`http://localhost:5000${url}`, { method });  
    return await result.json();
}

function getTestApp() {
    function MyComponent() {
        return (<div>Hello World!!!</div>);
    }

    const app = new Application();
    app.configuration.router
    .get('/', class Handler implements RouteHandler {
        public async handle(ctx: Context) {
            return stringResult('hello');
        }
    })
    .get('/object-result', async (ctx: Context) => { return { foo: "world" };})
    .get('/function-callback', async (ctx: Context) => { return stringResult('hello world'); })
    .get('/redirect', async (ctx: Context) => { return redirect('/helloworld'); })
    .get('/nothing', async (ctx: Context) => { return empty(); })
    .get('/with-wildcard/{value:*}', async ({ params }: Context) => { return stringResult(params.value); })
    .get('/with-params/{id:[A-Za-z]+}', async ({ params }: Context) => { return stringResult(params.id); })
    .get('/error', async (ctx: Context) => { throw new Error('oops'); })
    .get('/react', <MyComponent />)
    .get('/react2', MyComponent);

    return app;
}
