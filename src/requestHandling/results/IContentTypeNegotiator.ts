
export interface IContentTypeNegotiator {
    respondsTo(acceptHeader: string | string[]): boolean;
}
