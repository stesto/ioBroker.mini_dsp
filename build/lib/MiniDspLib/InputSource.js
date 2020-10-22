"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputSource = void 0;
class InputSource {
    constructor(miniDspDevice, index, name) {
        this.miniDspDevice = miniDspDevice;
        this.index = index;
        this.name = name;
    }
    get selected() {
        return false;
    }
    set selected(value) {
        if (value) {
            this.miniDspDevice._sendCmd(new Uint8Array([0x34, this.index]));
        }
    }
}
exports.InputSource = InputSource;
