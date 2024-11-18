import { HostingRequest, IOutputChannel } from "../adapters/IOutputChannel";
import { Configuration } from "../Configuration";
import { RouteRegistration } from "../types";

export interface Context {
    request: HostingRequest;
    output: IOutputChannel;
    config: Configuration
    params: Record<string, string>;
    matchedRoute?: RouteRegistration | undefined;
}