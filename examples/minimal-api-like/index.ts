import { Context, RouteHandlerClass, RouteTable, Application } from "../../src";

class Handler implements RouteHandlerClass {
    public async handle(ctx: Context) {
        console.log('hello');
        return 'hello';
    }
}

const router = new RouteTable();
router.get('/hello', Handler);
router.get('/world', async (ctx: Context) => {
    console.log('world');
    return 'world';
});

const app = new Application(router);
app.listen(3000);