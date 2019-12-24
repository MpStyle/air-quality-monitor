import crypto = require('crypto');

export class StringUtils {
    static padLeft(str: string | number, pad: string, max: number): string {
        const s = str.toString();
        return s.length < max ? this.padLeft(pad + s, pad, max) : s;
    }

    static randomString(): string {
        let result = '' + (new Date).getTime();
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;

        for (let i = 0; i < 18; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        const hash = crypto.createHash('sha512')
        hash.update(result)
        return hash.digest('hex')
    }
}