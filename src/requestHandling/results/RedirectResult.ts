import { IOutputChannel } from "../../adapters/IOutputChannel";
import { IActionResult } from "./IActionResult";

export class RedirectResult implements IActionResult {
    constructor(private location: string, private statusCode: 301 | 302 | 307 | 308 = 302) { }

    public executeResult(output: IOutputChannel) {
        output.writeHeaders(this.statusCode, { 'Location': this.location });
        output.end();
    }
}