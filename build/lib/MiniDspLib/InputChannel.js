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
var InputChannel_exports = {};
__export(InputChannel_exports, {
  InputChannel: () => InputChannel
});
module.exports = __toCommonJS(InputChannel_exports);
var utils = __toESM(require("../../lib/utils"));
class InputChannel {
  constructor(miniDspDevice, index) {
    this.miniDspDevice = miniDspDevice;
    this.index = index;
  }
  get gain() {
    return 0;
  }
  set gain(value) {
    this.miniDspDevice._setChannelGain(this.index, utils.cramp(value, -72, 12));
  }
  get mute() {
    return false;
  }
  set mute(value) {
    this.miniDspDevice._setChannelMute(this.index, value ? 1 : 2);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InputChannel
});
//# sourceMappingURL=InputChannel.js.map
