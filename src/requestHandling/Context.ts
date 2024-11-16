import { IOutputChannel } from "../adapters/IOutputChannel";
import { Configuration } from "../Configuration";
import { RouteRegistration } from "../types";

export interface Context {
    output: IOutputChannel;
    matchedRoute?: RouteRegistration;
    config: Configuration
}