'use strict';

import Vue from 'vue';
import TV from './service/sony-api';

function init() {

    const localStorageKey = 'tv-details';

    const vm = new Vue({
        el: '#remote',
        data: {
            tvs: [],
            selectedAddress: null,
            newTVDetails: {},
            show_add_tv: false,
        },
        methods: {
            pressRemoteButton: function(btn) {
                console.log('clickSource', btn, this.selectedTV());
                return this.selectedTV().remoteCommand(btn);
            },
            init: function() {
                this.getTVsFromStorage();
            },
            selectedTV: function () {
                const details = this.tvs.find(tv => {
                    return tv.address === this.selectedAddress;
                });

                return new TV(details.address, details.psk);
            },
            addTVToStorage: function (label, address, psk) {
                this.tvs.push({
                    label,
                    address,
                    psk,
                });
                window.localStorage.setItem(localStorageKey, JSON.stringify(this.tvs));
            },
            getTVsFromStorage: function() {
                const data = window.localStorage.getItem(localStorageKey);
                return this.tvs = data ? JSON.parse(data) : this.tvs;
            },
            processAddTVForm: function(event) {
                const that = this;
                event.preventDefault();

                const tv = new TV(this.newTVDetails.address, this.newTVDetails.psk);
                tv.remoteCommand('Display').then(function () {
                    that.addTVToStorage(that.newTVDetails.label, that.newTVDetails.address, that.newTVDetails.psk);
                    that.selectedAddress = that.newTVDetails.address;
                });
            }
        },
    });

    console.log('vm', vm);
    vm.init();
}

init();


/*


//                 // https://pro-bravia.sony.net/develop/integrate/rest-api/spec/service/appcontrol/v1_0/getApplicationList/index.html
//                 vm.tv.appControl.getApplicationList([]).then(data => {
//                     vm.rawHtml = '<ul><li>' + data.result[0].map(res => {
//                         return `<h3>${res.title}</h3><img src="${res.icon}" />`
//                     }).join('</li><li>') + '</li></ul>';
//                 });

//                 vm.tv.appControl.getApplicationStatusList([]).then(data => {
// console.log('getApplicationStatusList', data);
//                 });

//                 // https://pro-bravia.sony.net/develop/integrate/rest-api/spec/service/audio/v1_1/getSoundSettings/index.html
//                 vm.tv.audio.getSoundSettings([{'target': 'outputTerminal'}]).then(data => {
// console.log('getSoundSettings', data);
//                 });

//                 // https://pro-bravia.sony.net/develop/integrate/rest-api/spec/service/audio/v1_0/getVolumeInformation/index.html
//                 vm.tv.audio.getVolumeInformation([]).then(data => {
// console.log('getVolumeInformation', data);
//                 });

//                 // https://pro-bravia.sony.net/develop/integrate/rest-api/spec/service/audio/v1_2/setAudioVolume/index.html
//                 vm.tv.audio.setAudioVolume([{
//                     volume: '8',
//                     ui: 'on',
//                     target: '',
//                 }]).then(data => {
// console.log('setAudioVolume', data);
//                 });
*/