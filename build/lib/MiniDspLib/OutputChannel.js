var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var OutputChannel_exports = {};
__export(OutputChannel_exports, {
  OutputChannel: () => OutputChannel
});
module.exports = __toCommonJS(OutputChannel_exports);
var import_InputChannel = require("./InputChannel");
class OutputChannel extends import_InputChannel.InputChannel {
  constructor(miniDspDevice, index) {
    super(miniDspDevice, index);
  }
  get invert() {
    return false;
  }
  set invert(value) {
    this.miniDspDevice._setChannelMute(this.index - this.miniDspDevice.inputChannels.length + 80, value ? 1 : 0);
  }
  get delay() {
    return 0;
  }
  set delay(value) {
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OutputChannel
});
//# sourceMappingURL=OutputChannel.js.map
