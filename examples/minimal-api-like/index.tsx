import React from 'react';
import { Application } from "../../src";
import { Context } from "../../src/requestHandling/Context";
import { RouteTable } from '../../src/routing/RouteTable';
import { RouteHandler } from "../../src/types";
import { redirect, empty, stringResult } from "../../src/requestHandling/results";

class Handler implements RouteHandler {
    public async handle(ctx: Context) {
        return stringResult('hello');
    }
}

function MyComponent() {
    return (<div>Hello World!!!</div>);
}

const router = new RouteTable();
router.get('/', Handler);
router.get('/world', async (ctx: Context) => {
    return {
        foo: "world"
    };
});

router.get('/helloworld', async (ctx: Context) => {
    return stringResult('hello world');
});

router.get('/redirect', async (ctx: Context) => {
    return redirect('/helloworld');
});

router.get('/nothing', async (ctx: Context) => {
    return empty();
});

router.get('/with-wildcard/*', async ({ request }: Context) => {
    return stringResult("wildcard!");
});

router.get('/with-params/{id:.+}', async ({ request, params }: Context) => {
    return stringResult(params.id);
});

router.get('/error', async (ctx: Context) => {
    throw new Error('oops');
});

router.get('/react', <MyComponent />);
router.get('/react2', MyComponent);

const app = new Application({ router });
app.listen(3000);