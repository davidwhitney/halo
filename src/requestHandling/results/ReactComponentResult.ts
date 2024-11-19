import * as ReactDOMServer from 'react-dom/server';
import { IActionResult } from './IActionResult';
import { IOutputChannel } from '../../adapters/IOutputChannel';

export function reactComponent(component: any, statusCode = 200) {
    return new ReactComponentResult(component, statusCode);
}

export class ReactComponentResult implements IActionResult {
    constructor(private component: any, private statusCode: number = 200) { }

    public executeResult(output: IOutputChannel) {
        const html = ReactDOMServer.renderToString(this.component);
        output.writeHeaders(this.statusCode, { 'Content-Type': 'text/html' });
        output.writeBody(html);
        output.end();
    }
}
