from entity.Options import Options


def systemArgumentsReader(args) -> Options:
    options = Options()
    # for arg in args:
    i = 0
    while i < len(args):
        arg = args[i]

        if arg == '--no-upload':
            options.uploadData = False
            continue

        if arg == '-h' or arg == '--help':
            options.help = True
            continue

        if arg == '-v' or arg == '--verbose':
            options.verbose = True
            continue

        if arg == '--secret-key':
            options.secretKey = args[i+1]
            i += 1
            continue
        if arg == '--device-id':
            options.deviceId = args[i+1]
            i += 1
            continue
        if arg == '--device--name':
            options.uploadData = args[i+1]
            i += 1
            continue
        if arg == '--air-care-url':
            options.airCareUrl = args[i+1]
            i += 1
            continue

        if arg == '--upload-timeout':
            options.uploadTimeout = args[i+1]
            i += 1
            continue
        if arg == '--upload-retry':
            options.uploadRetry = args[i+1]
            i += 1
            continue

        i += 1

    return options


def printHelp():
    print("Device deamon")
    print("--no-upload      Not upload data to back-end")
    print("--secret-key     The secret key use in Cloud Functions")
    print("--device-id      The unique id of the device")
    print("--device--name   The name of the device")
    print("--air-care-url   The Cloud Functions back-end url")
    print("--upload-timeout The maximun time to wait a response from back-end")
    print("--upload-retry   The time to wait before retry the upload, set it to -1 to avoid retry")
    print("-v               Verbose")
