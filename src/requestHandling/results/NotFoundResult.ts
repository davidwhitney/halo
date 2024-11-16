import { IOutputChannel } from '../../adapters/IOutputChannel';
import { IActionResult } from './IActionResult';

export class NotFoundResult implements IActionResult {
    constructor() { }

    public executeResult(output: IOutputChannel) {
        output.writeHeaders(404, { 'Content-Type': 'text' });
        output.writeBody('Not Found');
        output.end();
    }
}
