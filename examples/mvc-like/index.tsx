import React from 'react';
import { Application } from "../../src";
import { Context } from "../../src/requestHandling/Context";
import { RouteTable } from '../../src/routing/RouteTable';

function MyComponent(props: { username: string }) {
    return (<div>Hello {props.username}</div>);
}

const router = new RouteTable();
router.get('/', async (ctx: Context) => {
    const viewModel = { username: "Bob" };
    return MyComponent(viewModel);
});

router.get('/test1', async (ctx: Context) => {
    const viewModel = { username: "Bob" };
    return <MyComponent {...viewModel} />;
});

router.get('/test2', async (ctx: Context) => {
    const userName = "Bob";
    return <MyComponent username={userName} />;
});


const app = new Application({ router });
app.listen(3000);