import { IOutputChannel } from '../adapters/IOutputChannel';
import { IActionResult } from './IActionResult';

export class JsonResult implements IActionResult {
    constructor(private data: any, private statusCode = 200) { }

    public executeResult(output: IOutputChannel) {
        output.writeHeaders(this.statusCode, { 'Content-Type': 'application/json' });
        output.writeBody(JSON.stringify(this.data));
        output.end();
    }
}
