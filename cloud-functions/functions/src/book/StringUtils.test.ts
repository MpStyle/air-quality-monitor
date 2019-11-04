import { StringUtils } from "./StringUtils";

test('StringUtils - padLeft', () => {
    expect(StringUtils.padLeft(1, '0', 4)).toEqual('0001');
});