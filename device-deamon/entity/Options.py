class Options:
    uploadData: bool = True
    help: bool = False
    verbose: bool = False
    secretKey: str
    deviceId: str
    deviceName: str
    airCareUrl: str

    uploadTimeout = 30
    uploadRetry = 60
