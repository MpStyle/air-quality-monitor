export class StringUtils {
    static padLeft(str: string | number, pad: string, max: number): string {
        const s = str.toString();
        return s.length < max ? this.padLeft(pad + s, pad, max) : s;
    }
}