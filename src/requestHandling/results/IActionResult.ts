import { IOutputChannel } from "../../adapters/IOutputChannel";

export interface IActionResult {
    executeResult(output: IOutputChannel): void;
}

