from entity.Options import Options


def systemArgumentsReader(args) -> Options:
    options = Options()
    for arg in args:
        if arg == '--no-upload':
            options.uploadData = False
            continue

        if arg == '-h' or arg == '--help':
            options.help = True
            continue

    return options
