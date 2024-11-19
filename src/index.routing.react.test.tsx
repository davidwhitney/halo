import React from 'react';
import { describe, it, expect, beforeAll } from 'vitest';
import { Context } from './requestHandling/Context';
import { Client, serve } from './testing/httpHelpers';
import { RouteTable } from './routing/RouteTable';

describe("Application routing - React support", () => {
    let client: Client;
    beforeAll(() => {
        client = serve((r: RouteTable) => r
        .get('/react1', MyComponent)
        .get('/react2', async (ctx: Context) => <MyComponent {...ctx} />)
        .get('/react3', <MyComponent />)
        );
    });

    it("can get react component rendered server side when passed as a function", async () => {
        const text = await client.reqText("/react1");
        expect(text).toContain("<div>Hello World!!! - <!-- -->GET<!-- --> - <!-- -->http://localhost/react1</div>");
    });

    it("can get react component rendered server side when returned from a function", async () => {
        const text = await client.reqText("/react2");
        expect(text).toContain("<div>Hello World!!! - <!-- -->GET<!-- --> - <!-- -->http://localhost/react2</div>");
    });

    it("can get react component rendered server side when passed as resolved markup", async () => {
        const text = await client.reqText("/react3");
        expect(text).toContain("<div>Hello World!!! - <!-- -->GET<!-- --> - <!-- -->http://localhost/react3</div>");
    });
});

function MyComponent(props?: Partial<Context>) {
    return (<div>Hello World!!! - {props?.request?.method} - {props?.request?.url}</div>);
}
