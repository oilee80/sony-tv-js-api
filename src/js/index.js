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
        beforeMount: function() {
            this.getTVsFromStorage();

            this.show_add_tv = this.tvs.length === 0;
        },
        methods: {
            pressRemoteButton: function(btn) {
                console.log('clickSource', btn, this.selectedTV());
                return this.selectedTV().remoteCommand(btn);
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
}

init();
