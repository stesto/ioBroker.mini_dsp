"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputChannel = void 0;
const utils = require("../../lib/utils");
class InputChannel {
    constructor(miniDspDevice, index) {
        this.miniDspDevice = miniDspDevice;
        this.index = index;
    }
    get gain() {
        return 0;
    }
    set gain(value) {
        this.miniDspDevice._setChannelGain(this.index, utils.cramp(value, -72.0, 12.0));
    }
    get mute() {
        return false;
    }
    set mute(value) {
        this.miniDspDevice._setChannelMute(this.index, value ? 0x01 : 0x02);
    }
}
exports.InputChannel = InputChannel;
