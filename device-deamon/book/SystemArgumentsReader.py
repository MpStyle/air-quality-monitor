from entity.Options import Options


def systemArgumentsReader(args) -> Options:
    options = Options()
    # for arg in args:
    i = 0
    while i < len(args):
        arg = args[i]

        if arg == '--no-upload':
            options.uploadData = False

        if arg == '-h' or arg == '--help':
            options.help = True

        if arg == '-v' or arg == '--verbose':
            options.verbose = True

        if arg == '--upload-timeout':
            options.uploadTimeout = int(args[i+1])
            i += 1

        if arg == '--upload-retry':
            options.uploadRetry = int(args[i+1])
            i += 1

        if arg == '--readings-buffer':
            options.readingsBuffer = int(args[i+1])
            i += 1

        i += 1

    return options


def printHelp():
    print("Air Quality Monitor - Device Deamon")
    print("--no-upload          Not upload data to back-end")
    print("--upload-timeout     The maximun time to wait a response from back-end")
    print("--upload-retry       The time to wait before retry the upload, set it to -1 to avoid retry")
    print("--readings-buffer    Readings to collect before upload them to the cloud")
    print("-v --verbose         Enabled verbose output")
