import React from 'react';
import { Application } from "../../src";
import { Context } from "../../src/requestHandling/Context";
import { RouteTable } from '../../src/routing/RouteTable';
import { RouteHandlerClass } from "../../src/types";
import { StringResult } from '../../src/requestHandling/results/StringResult';

class Handler implements RouteHandlerClass {
    public async handle(ctx: Context) {
        return 'hello';
    }
}

function MyComponent() {
    return (<div>Hello World!!!</div>);
}

const router = new RouteTable();
router.get('/hello', Handler);
router.get('/world', async (ctx: Context) => {
    return {
        foo: "world"
    };
});

router.get('/helloworld', async (ctx: Context) => {
    return new StringResult('hello world');
});

router.get('/react', <MyComponent />);

const app = new Application(router);
app.listen(3000);