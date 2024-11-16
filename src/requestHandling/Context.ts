import { IOutputChannel } from "../adapters/IOutputChannel";
import { RouteRegistration } from "../types";
export interface Context {
    output: IOutputChannel;
    matchedRoute?: RouteRegistration;
}