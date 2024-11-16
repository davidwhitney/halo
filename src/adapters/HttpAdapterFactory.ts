import NodeHttpAdapter from "./NodeHttpAdapter";
import DenoHttpAdapter from "./DenoHttpAdapter";

export default function createHttpAdapter() {
    // if node is executing process
    
    return new NodeHttpAdapter();
    return new DenoHttpAdapter();

    // if deno 
}