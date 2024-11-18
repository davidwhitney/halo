import React from "react";
import { IHandleRoutes, RouteHandlerConstructor } from "../types";

export default function detectHandlerType(handler: IHandleRoutes) {
    if (typeof handler === 'function') {
        if (handler.prototype && handler.prototype.handle && isConstuctorFunction(handler)) {
            return "constructor";
        } else if (isReactFunctionComponent(handler)) {
            return "react-component";
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

function isReactFunctionComponent(handler: Function): boolean {
    // Check if it's a named function following React component naming convention (PascalCase)
    // This is ugly and I get the idea that it'll cause a horrible bug somewhere.
    const isNamedComponent = /^[A-Z]/.test(handler.name);

    // Check for React specific properties
    const hasReactSpecificProps = 
        (handler as any).displayName !== undefined || 
        (handler as any).defaultProps !== undefined ||
        (handler as any).contextTypes !== undefined;

    return isNamedComponent || hasReactSpecificProps;
}