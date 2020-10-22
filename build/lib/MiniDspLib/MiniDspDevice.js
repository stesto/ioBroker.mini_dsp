"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiniDspDevice = void 0;
const hid = require("node-hid");
const utils = require("../utils");
const InputChannel_1 = require("./InputChannel");
const InputSource_1 = require("./InputSource");
const OutputChannel_1 = require("./OutputChannel");
hid.setDriverType("libusb");
class MiniDspDevice {
    constructor(vendorId, productId, inputSources, numberOfInputChannels, numberOfOutputChannels) {
        this.vendorId = vendorId;
        this.productId = productId;
        this.inputSources = [];
        for (let i = 0; i < inputSources.length; i++) {
            this.inputSources.push(new InputSource_1.InputSource(this, i, inputSources[i]));
        }
        // create indices of input channels (e.g. {0, 1} if a device has 2 input channels)
        this.inputChannels = [];
        for (let i = 0; i < numberOfInputChannels; i++) {
            this.inputChannels.push(new InputChannel_1.InputChannel(this, i));
        }
        // create indices of output channels (e.g. {2, 3, 4, 5} with an offset of the amount of input channels)
        this.outputChannels = [];
        for (let i = this.inputChannels.length; i < numberOfOutputChannels + this.inputChannels.length; i++) {
            this.outputChannels.push(new OutputChannel_1.OutputChannel(this, i));
        }
    }
    connect() {
        this.device = new hid.HID(this.vendorId, this.productId);
    }
    close() {
        var _a;
        (_a = this.device) === null || _a === void 0 ? void 0 : _a.close();
    }
    get masterVolume() {
        return 0; //return volume
    }
    set masterVolume(value) {
        this._sendCmd(new Uint8Array([0x42, utils.cramp(value, -127.5, 0) * -2]));
    }
    get masterMute() {
        return false; //return mute state
    }
    set masterMute(value) {
        this._sendCmd(new Uint8Array([0x17, value ? 1 : 0]));
    }
    _sendCmd(cmd) {
        var _a;
        const buff = new Uint8Array(65); // 64 + 1 for feature report id (neccessary in node-hid I guess?)
        buff[1] = cmd.length + 1; // Length-byte containing length of data + 1 byte for checksum at the end
        buff.set(cmd, 2); // insert data
        // calculate checksum
        buff[2 + cmd.length] =
            (cmd.reduce(function (pv, cv) {
                return pv + cv;
            }) +
                cmd.length +
                1) %
                0x100;
        (_a = this.device) === null || _a === void 0 ? void 0 : _a.write(Array.from(buff)); // write to miniDSP
    }
    _setChannelGain(index, gain) {
        const gainBuff = new Uint8Array(new Float32Array(utils.cramp(gain, -72.0, 12.0)).buffer);
        const cmdBuff = new Uint8Array([
            0x13,
            0x80,
            0x00,
            0x1a /* add offset (see IInputChannel.ts)*/ + index,
        ]);
        const buff = new Uint8Array(cmdBuff.length + gainBuff.length);
        buff.set(cmdBuff, 0);
        buff.set(gainBuff, cmdBuff.length);
        this._sendCmd(buff);
    }
    _setChannelMute(index, value) {
        this._sendCmd(new Uint8Array([0x13, 0x80, 0x00, 0x00 + index, value, 0x00, 0x00, 0x00]));
    }
    setInputSource(input) {
        if (typeof input === "number") {
            this.inputSources.forEach((val) => {
                if (val.index === input) {
                    val.selected = true;
                    return;
                }
            });
        }
        else if (typeof input === "string") {
            this.inputSources.forEach((val) => {
                if (val.name.toLowerCase() === input.toLowerCase()) {
                    val.selected = true;
                    return;
                }
            });
        }
    }
}
exports.MiniDspDevice = MiniDspDevice;
