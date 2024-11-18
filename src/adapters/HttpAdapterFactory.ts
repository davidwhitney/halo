import NodeHttpAdapter from "./NodeHttpAdapter";
import DenoHttpAdapter from "./DenoHttpAdapter";
import { IHttpAdapter } from "./IHttpAdapter";

export default function createHttpAdapter(): IHttpAdapter {
    if ((typeof navigator === "undefined")) {
        console.log("No navigator detected, defaulting to Node adapter");
        return new NodeHttpAdapter();
    }

    if (navigator.userAgent.includes("Deno")) {
        console.log("Using Deno adapter");
        return new DenoHttpAdapter();
    } else {
        console.log("Using Node adapter");
        return new NodeHttpAdapter();
    }
}