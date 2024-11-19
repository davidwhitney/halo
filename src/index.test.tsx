import React from 'react';
import { Application } from ".";
import { stringResult, redirect, empty, json } from "./requestHandling/results";
import { RouteHandler } from "./types";
import { beforeAll, describe, it, expect } from 'vitest';
import { Context } from './requestHandling/Context';

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

    it("can get handler instance request", async () => {
        const text = await reqText("/handler-instance");
        expect(text).toBe("hello");
    });

    it("can get 404 on not found", async () => {
        const text = await req("/not-found-here");
        expect(text.status).toBe(404);
    });

    it("can get basic function-callback request", async () => {
        const text = await reqText("/function-callback");
        expect(text).toBe("hello world");
    });

    it("can get object result", async () => {
        const text = await reqJson("/object-result");
        expect(text).toStrictEqual({ foo: "world" });
    });

    it("can get json object result", async () => {
        const text = await reqJson("/json-object-result");
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

    it("can get react component rendered server side when passed as a function", async () => {
        const text = await reqText("/react1");
        expect(text).toContain("<div>Hello World!!! - <!-- -->GET</div>");
    });

    it("can get react component rendered server side when returned from a function", async () => {
        const text = await reqText("/react2");
        expect(text).toContain("<div>Hello World!!! - <!-- -->GET</div>");
    });

    it("can get react component rendered server side when passed as resolved markup", async () => {
        const text = await reqText("/react3");
        expect(text).toContain("<div>Hello World!!! - <!-- -->GET</div>");
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
    function MyComponent(props?: Partial<Context>) {
        return (<div>Hello World!!! - {props?.request?.method}</div>);
    }

    class NamedHandler implements RouteHandler {
        public async handle(ctx: Context) {
            return stringResult('hello');
        }
    }

    const namedHandlerInstance = new NamedHandler();

    const app = new Application();
    app.configuration.router
    .get('/', class Handler implements RouteHandler {
        public async handle(ctx: Context) {
            return stringResult('hello');
        }
    })
    .get('/handler-instance', namedHandlerInstance)
    .get('/object-result', async (ctx: Context) => { return { foo: "world" };})
    .get('/json-object-result', async (ctx: Context) => { return json({ foo: "world" });})
    .get('/function-callback', async (ctx: Context) => { return stringResult('hello world'); })
    .get('/redirect', async (ctx: Context) => { return redirect('/helloworld'); })
    .get('/nothing', async (ctx: Context) => { return empty(); })
    .get('/with-wildcard/{value:*}', async ({ params }: Context) => { return stringResult(params.value); })
    .get('/with-params/{id:[A-Za-z]+}', async ({ params }: Context) => { return stringResult(params.id); })
    .get('/error', async (ctx: Context) => { throw new Error('oops'); })
    .get('/react1', MyComponent)
    .get('/react2', async (ctx: Context) => <MyComponent {...ctx} />)
    .get('/react3', <MyComponent />);

    return app;
}
