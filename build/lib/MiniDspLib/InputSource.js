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
var InputSource_exports = {};
__export(InputSource_exports, {
  InputSource: () => InputSource
});
module.exports = __toCommonJS(InputSource_exports);
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
      this.miniDspDevice._sendCmd(new Uint8Array([52, this.index]));
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InputSource
});
//# sourceMappingURL=InputSource.js.map
