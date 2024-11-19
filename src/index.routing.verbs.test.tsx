import { stringResult } from "./requestHandling/results";
import { describe, it, expect } from 'vitest';
import { Context } from './requestHandling/Context';
import { serve } from './testing/httpHelpers';
import { RouteTable } from './routing/RouteTable';

describe("Application routing - verbs", () => {    
    it("can distinguish between methods with identical routes", async () => {
        const client = serve((r: RouteTable) => r
            .get('/', async (ctx: Context) => (stringResult('get')))
            .post('/', async (ctx: Context) => (stringResult('post')))
        );

        const text = await client.reqText("/");
        expect(text).toBe("get");

        const postText = await client.reqText("/", "POST");
        expect(postText).toBe("post");
    });
});
