import React from "react";
import { IHandleRoutes, RouteHandlerConstructor } from "../types";

export default function detectHandlerType(handler: IHandleRoutes) {
    if (typeof handler === 'function') {
        if (handler.prototype && handler.prototype.handle && isConstuctorFunction(handler)) {
            return "constructor";
        } else {
            return "function";
        }
    } else if (React.isValidElement(handler)) {
        return "jsx-element";
    } else {
        return "handler-instance";
    }
}

function isConstuctorFunction(handler: IHandleRoutes): handler is RouteHandlerConstructor {
    return typeof handler === 'function';
}