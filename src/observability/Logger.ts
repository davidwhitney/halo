export class Logger {
    static info(message: string, ...args: any[]) {
        console.log(message, ...args);
    }

    static error(message: string, ...args: any[]) {
        console.error(message, ...args);
    }

    static warn(message: string, ...args: any[]) {
        console.warn(message, ...args);
    }

    static debug(message: string, ...args: any[]) {
        console.debug(message, ...args);
    }

    static trace(message: string, ...args: any[]) {
        console.trace(message, ...args);
    }

    static log(message: string, ...args: any[]) {
        console.log(message, ...args);
    }
}
