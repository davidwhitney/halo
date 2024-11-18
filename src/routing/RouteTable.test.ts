import { describe, it, expect } from "vitest";
import { RouteTable } from "./RouteTable";

describe("RouteTable", () => {
    it("matches nothing when no route found", () => {
        const sut = new RouteTable();

        const result = sut.match({ method: "GET", url: "http://localhost/", headers: {} });

        expect(result).toBeUndefined();
    });

    it("matches regular get route", () => {
        const route = async () => { return "hello"; };

        const sut = new RouteTable().get("/", route);

        const result = sut.match({ method: "GET", url: "http://localhost/", headers: {} });

        expect(result).toBeDefined();
        expect(result?.specifier).toBe("/");
        expect(result?.verb).toBe("GET");
        expect(result?.handler).toBe(route);
    });

    it("matches wildcard route", () => {
        const route = async () => { return "hello"; };

        const sut = new RouteTable().get("/hello/*", route);

        const result = sut.match({ method: "GET", url: "http://localhost/hello/123", headers: {} });

        expect(result).toBeDefined();
        expect(result?.specifier).toBe("/hello/*");
        expect(result?.verb).toBe("GET");
        expect(result?.handler).toBe(route);
    });
});