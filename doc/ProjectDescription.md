# Air quality monitor

## What

A simple, basic and complete exercise in style to create a cheap smart indoor air quality monitor.

## Why

For funny. For study. For hobby.

To create a DIY IoT air monitor.

### TL;DR

I am a pure software developer, so I have never learned how electronic stuff works.

Arduino, Raspberry, GPIO, chip, sensor, micro-controllers, ...? :confused: Theese are only a few examples of unknown words for me.

So, I have started this project to understand/learn theese new and "futuristic" technologies. 
I know, definig Raspberry a futuristic stuff, is same as saying  I'm old... :sweat_smile:

## How

As a software developer, hardware was the the challange.

I've  select Raspberry Pi instead of Arduino or other micro-controllers because it is well supported by a big community and it has a steep learning curve for an electronic outsider (and in case of failure it can be recycled as a mame console, multimedia box, nas, ....).

I've been reccomanded to choose the I2C devices by a colleague, who said: "they are well documented and there are a lot out-of-the-box libraries ready-to-use". :+1: I trusted him.

### Hardware

- Raspberry Pi 0 W => complete bundle
- CO2/Temperature/TVOC sensor x2 => CJMCU-8118
- Temperature/Humidity x1 => HW-611 E/P 280
- Temperature/Pressure sensor x1 => 
- Jumper Wires

Every component is available in the most popular eCommerce services,  such as Amazon and AliExpress.

### Software

We have 3 players in this procjet:
- cloud
- a device
- you

So, you can split it in 3 parts, one for each usage:
- cloud-function: Firebase function written in Typescript using NodeJS
- device-deamon: air data poller written in Python using third part libraries
- web-interface: air data interface writtern in Typescript using React/Redux