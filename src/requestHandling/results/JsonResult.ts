import { IOutputChannel } from '../../adapters/IOutputChannel';
import { IActionResult } from './IActionResult';
import { IContentTypeNegotiator } from './IContentTypeNegotiator';

export function json(data: any, statusCode = 200) {
    return new JsonResult(data, statusCode);
}

export class JsonResult implements IActionResult, IContentTypeNegotiator {
    constructor(private data: any, private statusCode = 200) { }

    public respondsTo(acceptHeader: string | string[]): boolean {
        if (acceptHeader 
            && acceptHeader.includes('application/json')
            || acceptHeader.includes('text/json')
            || acceptHeader.includes('application/javascript')
            || acceptHeader.includes('application/x-javascript')
            || acceptHeader.includes('text/javascript')
        ) {
            return true;
        }
        return false;
    }

    public executeResult(output: IOutputChannel) {
        output.writeHeaders(this.statusCode, { 'Content-Type': 'application/json' });
        output.writeBody(JSON.stringify(this.data));
        output.end();
    }
}
