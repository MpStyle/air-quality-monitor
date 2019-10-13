import { isNullOrUndefined, isString } from "util";
import { StringUtils } from "./StringUtils";

export enum LogLevel {
    debug, // - debugging information (hidden by default)
    info, // - a purely informational message (hidden by default)
    notice, // - condition normal, but significant
    warning, // (also aliased as warn) - condition warning
    error, // - condition error - to notify of errors accompanied with recovery mechanism (hence reported as log and not as uncaught exception)
}

export interface ILogging {
    log(message: string, level?: LogLevel): void;
    log(context: string, message: string, level?: LogLevel): void;
    log(param01: string, param02?: string | LogLevel, param03?: LogLevel): void;
}

export class Logging {
    private static instance: Logging;

    // private Logging() {}

    static get(): Logging {
        if (!Logging.instance) {
            Logging.instance = new Logging();
        }

        return Logging.instance;
    }

    log(message: string, level?: LogLevel): void;
    log(context: string, message: string, level?: LogLevel): void;
    log(param01: string, param02?: string | LogLevel, param03?: LogLevel): void {
        if (isNullOrUndefined(param03)) {
            if (isNullOrUndefined(param02)) {
                this.log_string(param01);
                return;
            }

            if (isString(param02)) {
                this.log_string_string(param01, param02);
                return;
            }

            this.log_string_LogLevel(param01, param02);
            return;
        }

        if (isString(param02)) {
            this.log_string_string_LogLevel(param01, param02, param03);
        }

        throw new Error("Invalid parameters type");
    }

    private log_string(message: string): void {
        console.log(`${this.getFormatedDate()} - ${LogLevel.info.toString()} - ${message}`);
    }

    private log_string_string(context: string, message: string): void {
        console.log(`${this.getFormatedDate()} - ${LogLevel.info.toString()} - ${context} - ${message}`);
    }

    private log_string_LogLevel(message: string, level: LogLevel): void {
        switch (level) {
            case LogLevel.error:
                console.error(`${this.getFormatedDate()} - ${level.toString()} - ${message}`);
            default:
                console.log(`${this.getFormatedDate()} - ${level.toString()} - ${message}`);
        }
    }

    private log_string_string_LogLevel(context: string, message: string, level: LogLevel): void {
        switch (level) {
            case LogLevel.error:
                console.error(`${this.getFormatedDate()} - ${level.toString()} - ${context} - ${message}`);
            default:
                console.log(`${this.getFormatedDate()} - ${level.toString()} - ${context} - ${message}`);
        }
    }

    private getFormatedDate(): string {
        const d = new Date;
        return (
            [
                d.getFullYear(),
                StringUtils.padLeft(d.getMonth() + 1, '0', 2),
                StringUtils.padLeft(d.getDate(), '0', 2),
            ].join('/')
            + ' ' +
            [
                StringUtils.padLeft(d.getHours(), '0', 2), ,
                StringUtils.padLeft(d.getMinutes(), '0', 2), ,
                StringUtils.padLeft(d.getSeconds(), '0', 2),
            ].join(':'));
    }
}