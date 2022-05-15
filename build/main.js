var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_ioBrokerConnector = require("./lib/MiniDspLib/ioBrokerConnector");
var import_MiniDspDevice = require("./lib/MiniDspLib/MiniDspDevice");
class MiniDsp extends utils.Adapter {
  constructor(options = {}) {
    super(__spreadProps(__spreadValues({}, options), {
      name: "mini_dsp"
    }));
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    this.setState("info.connection", false, true);
    this.dsp = new import_MiniDspDevice.MiniDspDevice(10066, 17, ["Analog", "Toslink", "USB"], 2, 4);
    this.dsp.connect();
    this.dspConnector = new import_ioBrokerConnector.ioBrokerConnector(this, this.dsp, "miniDsp2x4HD");
    this.dspConnector.PopulateAndSubscribeStates();
    this.setState("info.connection", true, true);
  }
  onUnload(callback) {
    var _a;
    try {
      (_a = this.dsp) == null ? void 0 : _a.close();
      callback();
    } catch (e) {
      callback();
    }
  }
  onStateChange(id, state) {
    this.dspConnector.stateChanged(id, state);
  }
}
if (require.main !== module) {
  module.exports = (options) => new MiniDsp(options);
} else {
  (() => new MiniDsp())();
}
//# sourceMappingURL=main.js.map
