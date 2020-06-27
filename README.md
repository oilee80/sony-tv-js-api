# Sony TV API

Makes use of the Sony TV's [REST API](https://pro-bravia.sony.net/develop/index.html).

## Getting the IP Address of the TV

[HOME] **Settings** => **Network** => **Advanced settings** => **Network status IP address**

## Getting the PSK (Pre-Shared Key)

[HOME] **Settings** => **Network** => **Home network setup** => **IP control Authentication**

Copied from [Sony Pro Display Knowledge Center](https://pro-bravia.sony.net/develop/integrate/ip-control/#ip-control-authentication)

## Example Usage:

```js
import TV from 'sony-tv-js-api';

const tv = new TV('<TV IP Address>', '<PSK>');

// Get a list of the supported remote control buttons
tv.system.getRemoteControllerInfo([]).then(response => {
    console.log(
        'remote control details:',
        response.result
    );
});

// Send a request (as if via the remote)
tv.remoteCommand('TvPower');

// Press numbers 1-9
tv.remoteCommand('Num1');
tv.remoteCommand('Num2');
tv.remoteCommand('Num3');
tv.remoteCommand('Num4');
tv.remoteCommand('Num5');
tv.remoteCommand('Num6');
tv.remoteCommand('Num7');
tv.remoteCommand('Num8');
tv.remoteCommand('Num9');
```

