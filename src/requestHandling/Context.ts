import { IOutputChannel } from "../adapters/IOutputChannel";
import { Configuration } from "../Configuration";
import { RouteRegistration } from "../types";

export interface Context {
    output: IOutputChannel;
    config: Configuration
    matchedRoute?: RouteRegistration | undefined;
}