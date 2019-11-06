# Air Quality Monitor - REST API

Google Firebase: REST API and database.
Google authentication for users.

Secret key authentication for devices.

Typescript.

## Configuration 

### Secret key

Set environment variable `airqualitymonitor.secretkey` using Firebase CLI:

```
firebase functions:config:set airqualitymonitor.secretkeys="__SECRET_KEYS__"
```

Split secret keys with `;`.

### Client ID
Set environment variable `airqualitymonitor.clientId` using Firebase CLI:

```
firebase functions:config:set airqualitymonitor.clientId="__CLIENT_ID__"
```

### Users emails
Set environment variable `airqualitymonitor.usersEmails` using Firebase CLI:

```
firebase functions:config:set airqualitymonitor.usersEmails="__USERS_EMAILS__"
```

List of the emails which can access to the application.

Split emails with `;`.