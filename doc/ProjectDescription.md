# Air quality monitor

## What

A simple, basic and complete exercise in style to create a cheap smart indoor air quality monitor.

## Why

For funny. For study. For hobby.

To create a DIY IoT air quality monitor.

### TL;DR

I am a pure software developer (Java, C#, Typescript, etc...), so I have never learned how electronic stuff works.

Arduino, Raspberry, GPIO, chip, sensor, micro-controllers, ...? :confused: Theese are only a few examples of unknown words for me.

So, I have started this project to understand/learn theese new and "futuristic" technologies. 
I know, definig Raspberry a futuristic stuff, is same as saying  I'm old... :sweat_smile:

## How

As a software developer, hardware was the challange.

I've  select __Raspberry Pi__ instead of Arduino or other micro-controllers because it is well supported by a big community and it has a steep learning curve for an electronic outsider (and in case of failure it can be recycled as a mame console, multimedia box, nas, ....).

I've been reccomanded to choose the __I2C__ devices by a colleague, who said: "they are well documented and there are a lot out-of-the-box libraries ready-to-use". :+1: I trusted him.

## Hardware

- Raspberry Pi 0 W => x1 => complete bundle
![Raspberry Pi 0 W](images/raspberry_p0_w.jpg)
- CO2/Temperature/TVOC sensor => x2 => CJMCU-8118
![CO2/Temperature/TVOC sensor](images/cjmcu_8118.jpg)
- Temperature/Humidity => x1 => DHT11 
![Temperature/Humidity](images/dht11.png)
- Temperature/Pressure sensor => x1 => HW-611 E/P 280  
![Temperature/Pressure](images/hw_611_e_p_280.jpg)
- Jumper Wires
![Jumper Wires](images/jumper_wires.jpg)

Every component is available in the most popular eCommerce services, such as Amazon and AliExpress.

## Software

We have 3 players in this procjet:
- cloud :cloud:
- a device :pager:
- you :angry:

So, you can split it in 3 parts, one for each usage:
- [Cloud functions](cloud-functions/README.md): [Firebase](https://en.wikipedia.org/wiki/Firebase) function written in Typescript using [NodeJS](https://en.wikipedia.org/wiki/Node.js)
- [Device Deamon](device-deamon/README.md): air data poller written in [Python](https://en.wikipedia.org/wiki/Python) using third part libraries
- [Web Interface](web-interface/README.md): air data interface writtern in [Typescript](https://en.wikipedia.org/wiki/TypeScript) using [React](https://en.wikipedia.org/wiki/React_(web_framework))/[Redux](https://en.wikipedia.org/wiki/Redux_(JavaScript_library))

## Price

These are approximately the prices for each components:

- Raspberry Pi 0 W: € 33.50
- CJMCU-8118: € 8.88
- DHT11: € 0.83
- HW-611 E/P 280: € 0.64
- Jumper Wires: € 1.00
- Firebase Cloud: free

__TOTAL__: € 44.85