import { ReactComponentResult } from "../requestHandling/results/ReactComponentResult";
import { Context } from "../requestHandling/Context";
import { RouteHandler } from "../types";
import React from "react";

export class ServerSideComponentRouteHandler implements RouteHandler {
    constructor(private component: JSX.Element) { }
    public async handle(ctx: Context) {
        const newProps = { ...this.component.props, ...ctx };
        const clone = React.cloneElement(this.component, newProps);
        return new ReactComponentResult(clone);
    }
}

export class ServerSideComponentThatRequiresInvocationHandler implements RouteHandler {
    constructor(private component: (props?: Context) => JSX.Element) { }
    public async handle(ctx: Context) {
        const output = this.component(ctx);
        return new ReactComponentResult(output);
    }
}