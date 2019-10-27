import ifaddr
import re


def getIpAddress():
    addresses = ""
    adapters = ifaddr.get_adapters()

    for adapter in adapters:
        if 'lo' != adapter.nice_name:
            for ip in adapter.ips:
                addresses = "%s%s;" % (addresses, ip.ip)

    return addresses
