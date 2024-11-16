import * as ReactDOMServer from 'react-dom/server';
import { IActionResult } from './IActionResult';
import { IOutputChannel } from '../adapters/IOutputChannel';

export class ComponentResult implements IActionResult {
    constructor(private component: any, private props: any) { }

    public executeResult(output: IOutputChannel) {
        const html = ReactDOMServer.renderToString(this.component);
        output.writeHeaders(200, { 'Content-Type': 'text/html' });
        output.writeBody(html);
        output.end();
    }
}
