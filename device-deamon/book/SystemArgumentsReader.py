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

        if arg == '-v' or arg == '--verbose':
            options.verbose = True
            continue

    return options
