import * as ReactDOMServer from 'react-dom/server';
import { IActionResult } from './IActionResult';
import { IOutputChannel } from '../../adapters/IOutputChannel';

export class ReactComponentResult implements IActionResult {
    constructor(private component: any, private props: any, private statusCode: number = 200) { }

    public executeResult(output: IOutputChannel) {
        const html = ReactDOMServer.renderToString(this.component);
        output.writeHeaders(this.statusCode, { 'Content-Type': 'text/html' });
        output.writeBody(html);
        output.end();
    }
}