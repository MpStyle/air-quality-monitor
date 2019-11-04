import { Logging } from './Logging';

test('Logging - debug', () => {
    const spy = jest.spyOn(console, 'debug').mockImplementation();

    const logging = new Logging();
    logging.debug("Test debug 01");

    expect(console.debug).toHaveBeenCalledTimes(1);

    const call = (console.debug as any).mock.calls[0][0] as string

    expect(call.indexOf(" - debug - Test debug 01")).toEqual(21);

    spy.mockRestore();
});

test('Logging - info', () => {
    const spy = jest.spyOn(console, 'info').mockImplementation();

    const logging = new Logging();
    logging.info("Test info 01");

    expect(console.info).toHaveBeenCalledTimes(1);

    const call = (console.info as any).mock.calls[0][0] as string

    expect(call.indexOf(" - info - Test info 01")).toEqual(21);

    spy.mockRestore();
});

test('Logging - error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();

    const logging = new Logging();
    logging.error("Test error 01");

    expect(console.error).toHaveBeenCalledTimes(1);

    const call = (console.error as any).mock.calls[0][0] as string

    expect(call.indexOf(" - error - Test error 01")).toEqual(21);

    spy.mockRestore();
});

test('Logging - warn', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    const logging = new Logging();
    logging.warn("Test warn 01");

    expect(console.warn).toHaveBeenCalledTimes(1);

    const call = (console.warn as any).mock.calls[0][0] as string

    expect(call.indexOf(" - warning - Test warn 01")).toEqual(21);

    spy.mockRestore();
});