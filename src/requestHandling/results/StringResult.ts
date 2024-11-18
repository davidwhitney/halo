import { IOutputChannel } from '../../adapters/IOutputChannel';
import { IActionResult } from './IActionResult';

export function stringResult(data: string, statusCode = 200) {
    return new StringResult(data, statusCode);
}

export class StringResult implements IActionResult {
    constructor(private data: string, private statusCode = 200) { }

    public executeResult(output: IOutputChannel) {
        output.writeHeaders(this.statusCode, { 'Content-Type': 'text' });
        output.writeBody(this.data || "");
        output.end();
    }
}
