import { IOutputChannel } from '../../adapters/IOutputChannel';
import { IActionResult } from './IActionResult';

export function statusCode(statusCode: number) {
    return new StatusCodeResult(statusCode);
}

export class StatusCodeResult implements IActionResult {
    constructor(private statusCode: number) { }

    public executeResult(output: IOutputChannel) {
        output.writeHeaders(this.statusCode, { });
        output.writeBody(null);
        output.end();
    }
}
