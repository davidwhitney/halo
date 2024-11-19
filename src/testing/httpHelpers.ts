import { Application } from "..";
import { RouteTable } from "../routing/RouteTable";

export function serve(cb: (routes: RouteTable) => void) {
    const routes = new RouteTable();
    cb(routes);
    const app = new Application({ router: routes });

    const randomPort = Math.floor(Math.random() * 4000) + 5000;

    app.listen(randomPort);
    return new Client(`http://localhost:${randomPort}`, app);
}

export class Client {
    constructor(public baseUrl: string, public app: Application) { }

    public async req(url: string, method: string = "GET", opts: RequestInit = {}) {
        return await fetch(`${this.baseUrl}${url}`, { method, ...opts });
    }
    
    public async reqText(url: string, method: string = "GET") {
        const result = await fetch(`${this.baseUrl}${url}`, { method });  
        return await result.text();
    }
    
    public async reqJson(url: string, method: string = "GET") {
        const result = await fetch(`${this.baseUrl}${url}`, { method });  
        return await result.json();
    }    
}