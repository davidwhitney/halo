import { IOutputChannel } from '../../adapters/IOutputChannel';
import { Logger } from '../../observability/Logger';
import { IActionResult } from './IActionResult';

export function json(data: any, statusCode = 200) {
    return new JsonResult(data, statusCode);
}

export class JsonResult implements IActionResult {
    constructor(private data: any, private statusCode = 200) { }

    public executeResult(output: IOutputChannel) {
        Logger.info("Writing JSON result", this.data);
        
        output.writeHeaders(this.statusCode, { 'Content-Type': 'application/json' });
        output.writeBody(JSON.stringify(this.data));
        output.end();
    }
}
