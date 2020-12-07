# Air quality monitor - Front-end

Measured data:

- CO<sub>2</sub>
- Pressure
- Noise
- TVOC (total volatile organic compounds)
- Humidity
- Temperature

## Environment variables

To create the configuration file for the environment variable, follow the guide [here](https://create-react-app.dev/docs/adding-custom-environment-variables/).

Remember to create at least the file __.env.production__ for production configuration.

I suggest to create also the file __.env.development.local__, for the development configuration.

The environment variables are:

- `REACT_APP_AIR_QUALITY_DATA_REMOTE_URL`: the remote URL of backend
- `REACT_APP_AIR_QUALITY_DATA_REFRESH_TIME`: air quality data refresh time in milliseconds

For example:
```
REACT_APP_AIR_QUALITY_DATA_REMOTE_URL=https://xxxxxxxxxx.cloudfunctions.net
REACT_APP_AIR_QUALITY_DATA_REFRESH_TIME=300000
```

## Build

```bash
yarn build
```

## Deploy

After build, run:

```bash
yarn deploy --project <project-id>
```