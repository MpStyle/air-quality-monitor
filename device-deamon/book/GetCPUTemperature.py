import subprocess
import re


def getCPUtemperature():
    temp = None
    process = subprocess.Popen(
        ['vcgencmd', 'measure_temp'], stdout=subprocess.PIPE)
    output, _error = process.communicate()
    if not _error:
        # https://stackoverflow.com/a/49563120/3904031
        m = re.search(r'[0-9]*\.[0-9]*', str(output))
        try:
            temp = float(m.group())
        except:
            pass
    return temp
