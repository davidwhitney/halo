import React from 'react';
import { stringResult } from "./requestHandling/results";
import { describe, it, expect, beforeAll } from 'vitest';
import { Context } from './requestHandling/Context';
import { Client, serve } from './testing/httpHelpers';
import { RouteTable } from './routing/RouteTable';

describe("Application routing - wildcard routing", () => {        
    let client: Client;
    beforeAll(() => {
        client = serve((r: RouteTable) => r
        .get('/with-wildcard/{value:*}', async ({ params }: Context) => { return stringResult(params.value); })
        .get('/with-params/{id:[A-Za-z]+}', async ({ params }: Context) => { return stringResult(params.id); })
        );
    });
    
    it("can use wildcard route", async () => {
        const randomValue = Math.random().toString();
        const text = await client.reqText("/with-wildcard/" + randomValue);
        expect(text).toBe(randomValue);
    });

    it("can use regex params route", async () => {
        const randomStringValueOfAz = Math.random().toString(36).replace(/[^a-z]+/g, '');
        const text = await client.reqText("/with-params/" + randomStringValueOfAz);
        expect(text).toBe(randomStringValueOfAz);
    });
});
