'use strict';

import axios from 'axios';

class TV {
    constructor(ipAddress, psk) {
        const headers = {
            'X-Auth-PSK': psk,
        };
        const irccHeaders = {
            'X-Auth-PSK': psk,
            'SOAPACTION': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"',
            'Content-Type': 'text/xml',
            'Accept': '*/*',
        };
        const apiVersionLookup = {
            appControl: {
                getApplicationList: '1.0',
                getApplicationStatusList: '1.0',
                getTextForm: '1.1',
                getWebAppStatus: '1.0',
                setActiveApp: '1.0',
                setTextForm: '1.1',
                terminateApps: '1.0',
            },
            audio: {
                getSoundSettings: '1.1',
                getVolumeInformation: '1.0',
                getVolumeInformation: '1.0',
                setAudioMute: '1.0',
                setAudioVolume: '1.2',
                setSoundSettings: '1.1',
                setSpeakerSettings: '1.0',
            },
            avContent: {
                getContentCount: '1.1',
                getContentList: '1.5',
                getPlayingContentInfo: '1.0',
                getCurrentExternalInputsStatus: '1.1',
                getSchemeList: '1.0',
                getSourceList: '1.0',
                getSpeakerSettings: '1.0',
                setPlayContent: '1.0',
            },
            encryption: {
                getPublicKey: '1.0',
            },
            guide: {
                getSupportedApiInfo: '1.0',
            },
            system: {
                getLEDIndicatorStatus: '1.0',
                getRemoteControllerInfo: '1.0',
                getPowerStatus: '1.0',
                getCurrentTime: '1.1',
                getInterfaceInformation: '1.0',
                getNetworkSettings: '1.0',
                getPowerSavingMode: '1.0',
                getRemoteDeviceSettings: '1.0',
                getSystemInformation: '1.0',
                getSystemSupportedFunction: '1.0',
                getWolMode: '1.0',
                requestReboot: '1.0',
                setLEDIndicatorStatus: '1.1',
                setLanguage: '1.0',
                setPowerSavingMode: '1.0',
                setPowerStatus: '1.0',
                setWolMode: '1.0',
            },
            videoScreen: {
                setSceneSetting: '1.0',
            }
        }

        // IRCC sends data in a different format (xml)
        function ircc(code) {
            const data = [
                '<s:Envelope',
                    'xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"',
                    's:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
                    '<s:Body>',
                        '<u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">',
                            `<IRCCCode>${code}</IRCCCode>`,
                        '</u:X_SendIRCC>',
                    '</s:Body>',
                '</s:Envelope>',
            ];
            return axios.post(`http://${ipAddress}/sony/ircc`, data.join(' '), {headers: irccHeaders});
        }

        let irccCommandsPromise;

        const proxy = new Proxy(this, {
            get: (target, namespace) => {
                if (namespace === 'remoteCommand') {
                    if (!irccCommandsPromise) {
                        irccCommandsPromise = proxy.system.getRemoteControllerInfo([]).then(response => {
                            return response.result[1].reduce((carry, dat) => {
                                carry[dat.name] = dat.value;
                                return carry;
                            }, {});
                        });
                    }
                    return (btn) => {
                        return irccCommandsPromise.then(codes => {
                            return ircc(codes[btn]);
                        });
                    }
                    // return new Proxy(target, {
                    //     get: (target, method) => {

                    //     }
                    // });
                    return irccCommandsPromise.then(codes => {
                        return ircc(codes[namespace]);
                    });
                }
                return new Proxy(target, {
                    get: (target, method) => {
                        if (namespace === 'sony' && method === 'ircc') {
                            return ircc;
                        }
                        return (params) => {
                            return axios.post(`http://${ipAddress}/sony/${namespace}`, {
                                id: 1,
                                method,
                                params,
                                version: apiVersionLookup[namespace][method],
                            }, {
                                headers
                            }).then(response => {
                                if (response.data.error) {
                                    console.error(`Error requesting: ${namespace}.${method}`);
                                    throw response.data;
                                }
                                return response.data;
                            });
                        }
                    }
                })
            },
        });

        // proxy.prototype.ircc = code => {
        //     const data = [
        //         '<s:Envelope',
        //         'xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"',
        //         's:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
        //         '<s:Body>',
        //         '<u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">',
        //         `<IRCCCode>${code}</IRCCCode>`,
        //         '</u:X_SendIRCC>',
        //         '</s:Body>',
        //         '</s:Envelope>',
        //     ];
        //     return this.sony.ircc(data.join(''));
        // }

        return proxy;
    }

    // ircc(code) {
    //     const data = [
    //         '<s:Envelope',
    //         'xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"',
    //         's:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
    //         '<s:Body>',
    //         '<u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">',
    //         `<IRCCCode>${code}</IRCCCode>`,
    //         '</u:X_SendIRCC>',
    //         '</s:Body>',
    //         '</s:Envelope>',
    //     ];
    //     return this.sony.ircc(data.join(''));
    // }
}



export default TV;