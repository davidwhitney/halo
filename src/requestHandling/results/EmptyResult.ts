import { StatusCodeResult } from './StatusCodeResult';

export class EmptyResult extends StatusCodeResult {
    constructor(statusCode = 204) {
        super(statusCode);
    }
}
