import { describe, it, expect } from "vitest";
import { RouteHandler } from "../types";
import detectHandlerType from "./detectHandlerType";

describe("detectHandlerType", () => {
    it("should return 'constructor' for a class constructor", () => {
        const handler = class implements RouteHandler { 
            async handle() { return null; }
        };
        new handler().handle();

        const result = detectHandlerType(handler);

        expect(result).toBe("constructor");
    });
});