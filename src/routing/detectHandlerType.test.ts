import { describe, it, expect } from "vitest";
import { RouteHandler } from "../types";
import detectHandlerType from "./detectHandlerType";
import { IActionResult } from "../requestHandling/results/IActionResult";

describe("detectHandlerType", () => {
    it("should return 'constructor' for a class constructor", () => {
        const handler = class implements RouteHandler { 
            async handle() { return {} as IActionResult; }
        };
        new handler().handle();

        const result = detectHandlerType(handler);

        expect(result).toBe("constructor");
    });
});