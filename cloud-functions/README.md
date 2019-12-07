# Air Quality Monitor - Cloud Functions

It is the back-end of the project infrastructure.

Used:
- Google Firebase: REST API and database.
- Secret key authentication for devices and users.

Written in Typescript.

## Development

Download remote configuration and emulate the Firebase functions.

```
firebase functions:config:get > .runtimeconfig.json
firebase emulators:start
```

## Deploy

```bash
firebase deploy --only functions
```

## Configuration 

### Secret keys

Split secret keys with `;`.

Set environment variable `airqualitymonitor.secretkeys` using Firebase CLI:

```bash
firebase functions:config:set airqualitymonitor.secretkeys="__SECRET_KEYS__"
```
