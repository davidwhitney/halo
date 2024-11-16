export type OnRequestCallback = (channel: IOutputChannel) => Promise<void>;

export interface HostingRequest { 
    url: string;
    method: string; 
    headers: Record<string, string | string[]>;
}

export interface IOutputChannel {
    request: HostingRequest;

    writeHeaders(statusCode: number, headers: Record<string, string>): void;
    writeBody(body: any): void;
    end(): void;
}
