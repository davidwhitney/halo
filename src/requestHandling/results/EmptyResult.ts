import { StatusCodeResult } from './StatusCodeResult';

export function empty(statusCode = 204) {
    return new EmptyResult(statusCode);
}

export class EmptyResult extends StatusCodeResult {
    constructor(statusCode = 204) {
        super(statusCode);
    }
}
