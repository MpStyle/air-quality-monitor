# Installation Guide

## Firebase Cloud Functions

### Configuration
- Install [nodejs and npm](https://nodejs.org/en/) 
- Install Firebase cli (use the right privilegies):
```
npm install -g firebase-tools
```
- Install the dependencies, run the command in the "_web-interface_" folder:
```
npm install
```

### Deploy
In order to deploy, you have to login in Firebase. Run:
```
firebase login
```
And follow the instructions on the browser.

Settings:
- __TODO__ Add commands 

After that, you can deploy the web interface, run:
```
firebase deploy --only functions --project <firebase-project-id>
```

## Firebase Web Interface

### Configuration
- Install [nodejs and npm](https://nodejs.org/en/) 
- Install Yarn
```
npm install -g yarn
```
- Install Firebase cli (use the right privilegies):
```
npm install -g firebase-tools
```
- Install the dependencies, run the command in the "_web-interface_" folder:
```
yarn install
```

### Run and deploy
To run the web interface in your PC, run the following command in the "_web-interface_" folder:
```
yarn start
```

In order to deploy, you have to login in Firebase. Run:
```
firebase login
```
And follow the instructions on the browser.

After that, you can deploy the web interface, run:
```
yarn deploy --project <firebase-project-id>
```

## Arduino IDE

The IDE used to write the code for the board is Arduino IDE.
First at all, we must download the necessary libraries to start working.

### Install board

To install the ESP32 board in your Arduino IDE, follow these next instructions:

- In your Arduino IDE, go to "_File_" > "_Preferences_"
- Enter "_https://dl.espressif.com/dl/package_esp32_index.json_" into the “_Additional Board Manager URLs_” field as shown in the figure below. Then, click the “_OK_” button.  
**Note**: if you already have the ESP8266 boards URL, you can separate the URLs with a comma
- Open the Boards Manager. Go to "_Tools_" > "_Board_" > "_Boards Manager…_"
- Search for "_ESP32_" and press install button for the "_ESP32 by Espressif Systems_"

Now, plug the ESP32 board to your computer. With your Arduino IDE open, follow these steps:

1. Select your Board in Tools > Board menu (in my case it’s the DOIT ESP32 DEVKIT V1)
2. Select the Port

The board is configured.

### Install sensors drivers

In order to run the project, you have to install the sensors drivers.

Go to "_Tools_" > "_Manage libraries_" and install the following libraries:

- NTPClient
- WiFi
- Adafruit BM280 Library
- Adafruit CCS811 Library
- DHT sensor library

### Create Configuration.h

Create a file called "_Configuration.h_" in the "_device_loop/device_loop_" folder, open and add the following lines of code:

```c
#ifndef CONFIGURATION_H
#define CONFIGURATION_H

/**** START CONFIGURATION ****/
char *WIFI_SSID = "*************";
char *WIFI_PASSWORD = "*************";
char *BACKEND_SERVICE_URL = "*************";
char *DEVICE_ID = "*************";
char *DEVICE_NAME = "*************";
char *DEVICE_ADDRESS = "*************";
char *SECRET_KEY = "*************";
/**** END CONFIGURATION ****/

#endif
```

Replace "_*************_" with the right information for every field.

## Board