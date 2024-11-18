import { describe, it, expect } from "vitest";
import { RouteTable } from "./RouteTable";

describe("RouteTable", () => {
    it("can correctly use the convenience methods", () => {
        const route = async () => { return "hello"; };

        const sut = new RouteTable()
            .get("/", route)
            .post("/", route)
            .put("/", route)
            .delete("/", route)
            .patch("/", route)
            .head("/", route);

        expect(sut.entries.size).toBe(6);
        expect(sut.entries.get("GET::/")).toBeDefined();
        expect(sut.entries.get("POST::/")).toBeDefined();
        expect(sut.entries.get("PUT::/")).toBeDefined();
        expect(sut.entries.get("DELETE::/")).toBeDefined();
        expect(sut.entries.get("PATCH::/")).toBeDefined();
        expect(sut.entries.get("HEAD::/")).toBeDefined();
    });

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

        expect(result?.specifier).toBe("/hello/*");
        expect(result?.handler).toBe(route);
    });

    it("matches wildcard route with capture", () => {
        const route = async () => { return "hello"; };
        const sut = new RouteTable().get("/hello/{rest:*}", route);

        const result = sut.match({ method: "GET", url: "http://localhost/hello/123", headers: {} });

        expect(result?.specifier).toBe("/hello/{rest:*}");
        expect(result?.params?.rest).toBe("123");
    });

    it("captures param from route", () => {
        const route = async () => { return "hello"; };
        const sut = new RouteTable().get("/users/{id:[0-9]+}", route);
    
        const result = sut.match({ method: "GET", url: "http://localhost/users/123", headers: {} });
    
        expect(result).toBeDefined();
        expect(result?.params?.id).toBe("123");
    });

    it("captures param from middle of route", () => {
        const route = async () => { return "hello"; };
        const sut = new RouteTable().get("/users/{id:[0-9]+}/foo", route);
    
        const result = sut.match({ method: "GET", url: "http://localhost/users/123/foo", headers: {} });
    
        expect(result).toBeDefined();
        expect(result?.specifier).toBe("/users/{id:[0-9]+}/foo");
        expect(result?.params?.id).toBe("123");
    });

    it("does not match when regex pattern fails", () => {
        const route = async () => { return "hello"; };
        const sut = new RouteTable().get("/users/{id:[0-9]+}", route);
    
        const result = sut.match({ method: "GET", url: "http://localhost/users/abc", headers: {} });
    
        expect(result).toBeUndefined();
    });
});