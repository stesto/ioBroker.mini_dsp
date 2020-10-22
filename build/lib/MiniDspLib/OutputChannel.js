"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputChannel = void 0;
const InputChannel_1 = require("./InputChannel");
class OutputChannel extends InputChannel_1.InputChannel {
    constructor(miniDspDevice, index) {
        super(miniDspDevice, index);
    }
    get invert() {
        return false; // return if phase is inverted
    }
    set invert(value) {
        this.miniDspDevice._setChannelMute(this.index - this.miniDspDevice.inputChannels.length + 0x50, value ? 0x01 : 0x00);
    }
    get delay() {
        return 0;
    }
    set delay(value) {
        //set delay
    }
}
exports.OutputChannel = OutputChannel;
