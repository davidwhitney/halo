import { IOutputChannel } from '../../adapters/IOutputChannel';
import { IActionResult } from './IActionResult';
import { IContentTypeNegotiator } from './IContentTypeNegotiator';
import { XMLBuilder } from 'fast-xml-parser';

export function xml(data: any, statusCode = 200) {
    return new XmlResult(data, statusCode);
}

export class XmlResult implements IActionResult, IContentTypeNegotiator {
    constructor(private data: any, private statusCode = 200) { }
    
    public respondsTo(acceptHeader: string | string[]): boolean {
        if (acceptHeader 
            && acceptHeader.includes('text/xml') 
            || acceptHeader.includes('application/xml') 
            || acceptHeader.includes('application/xhtml+xml')
            || acceptHeader.includes('application/rss+xml')
            || acceptHeader.includes('application/atom+xml')
        ) {
            return true;
        }
        return false;
    }

    public executeResult(output: IOutputChannel) {
        const builder = new XMLBuilder({
            ignoreAttributes: false,
        });

        const xml = builder.build(this.data);

        output.writeHeaders(this.statusCode, { 'Content-Type': 'application/xml' });
        output.writeBody(xml);
        output.end();
    }
}
