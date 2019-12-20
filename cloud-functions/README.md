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

### Create index

In the database you must create the index for the _measurement_ collection and indexed fields:
- deviceId ascending 
- type ascending 
- inserted descending

### Deploy functions

```bash
firebase deploy --only functions
```

## Configuration 

### Authorizations

The configuration `airqualitymonitor.authorizations` collects the secret keys and what air quality data is possible to read and/or to write from a device.

```json
[
    {
        "secretKey": "...",
        "authorizations": [
            {
                "deviceId": "...",
                "scopes": [ "...", "..." ]
            }
        ]
    }
]
```

- The field `secretKey`
- The field `authorizations`
- The field `deviceId`
- The field `scopes`