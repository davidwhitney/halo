import React from 'react';
import { Application } from "../../src";
import { Context } from "../../src/requestHandling/Context";
import { RouteTable } from '../../src/routing/RouteTable';
import { RouteHandlerClass } from "../../src/types";

class Handler implements RouteHandlerClass {
    public async handle(ctx: Context) {
        console.log('hello');
        return 'hello';
    }
}

function MyComponent() {
    return (<div>Hello World!!!</div>);
}

const router = new RouteTable();
router.get('/hello', Handler);
router.get('/world', async (ctx: Context) => {
    console.log('world');
    return 'world';
});

router.get('/react', <MyComponent />);

const app = new Application(router);
app.listen(3000);