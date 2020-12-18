#ifndef WIFIDATA_H
#define WIFIDATA_H

#include <WiFi.h>

struct WiFiData
{
    char *ssid;
    IPAddress ip;
    long strenght;
};

#endif