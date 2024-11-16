import { IOutputChannel } from "../../adapters/IOutputChannel";
import { IActionResult } from "./IActionResult";

type RedirectStatusCodes = 301 | 302 | 307 | 308;

export function redirect(location: string, statusCode: RedirectStatusCodes = 302) {
    return new RedirectResult(location, statusCode);
}

export class RedirectResult implements IActionResult {
    constructor(private location: string, private statusCode: RedirectStatusCodes = 302) { }

    public executeResult(output: IOutputChannel) {
        output.writeHeaders(this.statusCode, { 'Location': this.location });
        output.end();
    }
}