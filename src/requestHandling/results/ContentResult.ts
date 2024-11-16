import { IOutputChannel } from '../../adapters/IOutputChannel';
import { IActionResult } from './IActionResult';

export function content(content: string, contentType: string, statusCode = 200) {
    return new ContentResult(content, contentType, statusCode);
}

export class ContentResult implements IActionResult {
    constructor(private content: string, private contentType: string, private statusCode = 200) { }

    public executeResult(output: IOutputChannel) {
        output.writeHeaders(this.statusCode, { 'Content-Type': this.contentType });
        output.writeBody(this.content);
        output.end();
    }
}
