import { isNullOrUndefined, isString } from "util";
import { StringUtils } from "./StringUtils";

export enum LogLevel {
    debug, // - debugging information
    info, // - a purely informational message
    notice, // - condition normal, but significant
    warning, // (also aliased as warn) - condition warning
    error, // - condition error - to notify of errors accompanied with recovery mechanism (hence reported as log and not as uncaught exception)
}

export interface ILogging {
    log(message: string, level?: LogLevel): void;
    log(context: string, message: string, level?: LogLevel): void;
    log(param01: string, param02?: string | LogLevel, param03?: LogLevel): void;

    debug(param01: string, param02?: string): void;
    info(param01: string, param02?: string): void;
    notice(param01: string, param02?: string): void;
    warn(param01: string, param02?: string): void;
    error(param01: string, param02?: string): void;
}

export class Logging {
    private static readonly DEFAULT_LOG_LEVEL = LogLevel.info;
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
    log(param01: string, param02?: string | LogLevel | null, param03?: LogLevel): void {
        if (isNullOrUndefined(param03)) {
            if (isNullOrUndefined(param02)) {
                this.print(null, param01, Logging.DEFAULT_LOG_LEVEL);
                return;
            }

            if (isString(param02)) {
                this.print(param01, param02, Logging.DEFAULT_LOG_LEVEL);
                return;
            }

            this.print(null, param01, param02);
            return;
        }

        if (isString(param02)) {
            this.print(param01, param02, param03);
            return;
        }

        throw new Error(`Invalid parameters type: param01 => ${typeof (param01)}, param02 => ${typeof (param02)}, param03 => ${typeof (param03)}`);
    }

    debug(param01: string, param02?: string): void { isNullOrUndefined(param02) ? this.log(param01, LogLevel.debug) : this.log(param01, param02, LogLevel.debug); }

    info(param01: string, param02?: string): void { isNullOrUndefined(param02) ? this.log(param01, LogLevel.info) : this.log(param01, param02, LogLevel.info); }

    notice(param01: string, param02?: string): void { isNullOrUndefined(param02) ? this.log(param01, LogLevel.notice) : this.log(param01, param02, LogLevel.notice); }

    warn(param01: string, param02?: string): void { isNullOrUndefined(param02) ? this.log(param01, LogLevel.warning) : this.log(param01, param02, LogLevel.warning); }

    error(param01: string, param02?: string): void { isNullOrUndefined(param02) ? this.log(param01, LogLevel.error) : this.log(param01, param02, LogLevel.error); }

    private print(context: string | null, message: string, level: LogLevel): void {
        const toPrint = `${this.getFormatedDate()} - ${this.getLogLevelName(level)} ${context ? `- ${context}` : ''} - ${message}`;

        switch (level) {
            case LogLevel.error:
                console.error(toPrint);
            default:
                console.log(toPrint);
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

    private getLogLevelName(logLevel: LogLevel): string {
        return LogLevel[logLevel];
    }
}