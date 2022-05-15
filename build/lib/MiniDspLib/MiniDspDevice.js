var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var MiniDspDevice_exports = {};
__export(MiniDspDevice_exports, {
  MiniDspDevice: () => MiniDspDevice
});
module.exports = __toCommonJS(MiniDspDevice_exports);
var hid = __toESM(require("node-hid"));
var utils = __toESM(require("../utils"));
var import_InputChannel = require("./InputChannel");
var import_InputSource = require("./InputSource");
var import_OutputChannel = require("./OutputChannel");
hid.setDriverType("libusb");
class MiniDspDevice {
  constructor(vendorId, productId, inputSources, numberOfInputChannels, numberOfOutputChannels) {
    this.vendorId = vendorId;
    this.productId = productId;
    this.inputSources = [];
    for (let i = 0; i < inputSources.length; i++) {
      this.inputSources.push(new import_InputSource.InputSource(this, i, inputSources[i]));
    }
    this.inputChannels = [];
    for (let i = 0; i < numberOfInputChannels; i++) {
      this.inputChannels.push(new import_InputChannel.InputChannel(this, i));
    }
    this.outputChannels = [];
    for (let i = this.inputChannels.length; i < numberOfOutputChannels + this.inputChannels.length; i++) {
      this.outputChannels.push(new import_OutputChannel.OutputChannel(this, i));
    }
  }
  connect() {
    this.device = new hid.HID(this.vendorId, this.productId);
  }
  close() {
    var _a;
    (_a = this.device) == null ? void 0 : _a.close();
  }
  get masterVolume() {
    return 0;
  }
  set masterVolume(value) {
    this._sendCmd(new Uint8Array([66, utils.cramp(value, -127.5, 0) * -2]));
  }
  get masterMute() {
    return false;
  }
  set masterMute(value) {
    this._sendCmd(new Uint8Array([23, value ? 1 : 0]));
  }
  _sendCmd(cmd) {
    var _a;
    const buff = new Uint8Array(65);
    buff[1] = cmd.length + 1;
    buff.set(cmd, 2);
    buff[2 + cmd.length] = (cmd.reduce(function(pv, cv) {
      return pv + cv;
    }) + cmd.length + 1) % 256;
    (_a = this.device) == null ? void 0 : _a.write(Array.from(buff));
  }
  _setChannelGain(index, gain) {
    const gainBuff = new Uint8Array(new Float32Array([utils.cramp(gain, -72, 12)]).buffer);
    const cmdBuff = new Uint8Array([
      19,
      128,
      0,
      26 + index
    ]);
    const buff = new Uint8Array(cmdBuff.length + gainBuff.length);
    buff.set(cmdBuff, 0);
    buff.set(gainBuff, cmdBuff.length);
    this._sendCmd(buff);
  }
  _setChannelMute(index, value) {
    this._sendCmd(new Uint8Array([19, 128, 0, 0 + index, value, 0, 0, 0]));
  }
  setInputSource(input) {
    if (typeof input === "number") {
      this.inputSources.forEach((val) => {
        if (val.index === input) {
          val.selected = true;
          return;
        }
      });
    } else if (typeof input === "string") {
      this.inputSources.forEach((val) => {
        if (val.name.toLowerCase() === input.toLowerCase()) {
          val.selected = true;
          return;
        }
      });
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MiniDspDevice
});
//# sourceMappingURL=MiniDspDevice.js.map
