import { IOutputChannel } from '../../adapters/IOutputChannel';
import { IActionResult } from './IActionResult';

export class StatusCodeResult implements IActionResult {
    constructor(private statusCode: number) { }

    public executeResult(output: IOutputChannel) {
        output.writeHeaders(this.statusCode, { });
        output.writeBody(null);
        output.end();
    }
}
