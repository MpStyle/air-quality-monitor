# Air Quality Monitor - REST API

Google Firebase.

Typescript.

REST API and database.

Authentication.

## Configuration 

Set environment variable `airqualitymonitor.secretkey` using Firebase CLI:

```
firebase functions:config:set airqualitymonitor.secretkey="__SECRET_KEY__"
```

Set environment variable `airqualitymonitor.clientId` using Firebase CLI:

```
firebase functions:config:set airqualitymonitor.clientId="__CLIENT_ID__"
```

Set environment variable `airqualitymonitor.usersEmails` using Firebase CLI:

```
firebase functions:config:set airqualitymonitor.usersEmails="__USERS_EMAIL__"
```

List of the emails which can access to the application.

Split emails with a `;`.