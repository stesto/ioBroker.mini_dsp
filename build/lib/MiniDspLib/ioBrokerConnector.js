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
var ioBrokerConnector_exports = {};
__export(ioBrokerConnector_exports, {
  ioBrokerConnector: () => ioBrokerConnector
});
module.exports = __toCommonJS(ioBrokerConnector_exports);
var utils = __toESM(require("../utils"));
class ioBrokerConnector {
  constructor(adapter, dsp, deviceName) {
    this.adapter = adapter;
    this.dsp = dsp;
    this.deviceName = deviceName;
  }
  PopulateAndSubscribeStates() {
    let stateId;
    stateId = this.deviceName + ".masterVolume";
    this.adapter.setObjectNotExists(stateId, {
      type: "state",
      common: {
        name: "MasterVolume",
        type: "number",
        role: "level.volume",
        read: true,
        write: true,
        min: -127.5,
        max: 0,
        def: 0,
        unit: "dB"
      },
      native: {}
    });
    this.adapter.subscribeStates(stateId);
    stateId = this.deviceName + ".masterMute";
    this.adapter.setObjectNotExists(stateId, {
      type: "state",
      common: {
        name: "Master Mute",
        type: "boolean",
        role: "switch",
        read: true,
        write: true,
        def: false
      },
      native: {}
    });
    this.adapter.subscribeStates(stateId);
    for (let i = 0; i < this.dsp.inputSources.length; i++) {
      stateId = this.deviceName + ".inputSource." + (i + 1);
      this.adapter.setObjectNotExists(stateId, {
        type: "state",
        common: {
          name: this.dsp.inputSources[i].name,
          type: "boolean",
          role: "switch",
          read: true,
          write: true,
          def: i == 0 ? true : false
        },
        native: {}
      });
      this.adapter.subscribeStates(stateId);
    }
    for (let i = 0; i < this.dsp.inputChannels.length; i++) {
      stateId = this.deviceName + ".inputChannel." + (i + 1) + ".gain";
      this.adapter.setObjectNotExists(stateId, {
        type: "state",
        common: {
          name: "Gain",
          type: "number",
          role: "level.volume",
          read: true,
          write: true,
          min: -72,
          max: 12,
          def: 0,
          unit: "dB"
        },
        native: {}
      });
      this.adapter.subscribeStates(stateId);
      stateId = this.deviceName + ".inputChannel." + (i + 1) + ".mute";
      this.adapter.setObjectNotExists(stateId, {
        type: "state",
        common: {
          name: "Mute",
          type: "boolean",
          role: "switch",
          read: true,
          write: true,
          def: false
        },
        native: {}
      });
      this.adapter.subscribeStates(stateId);
    }
    for (let i = 0; i < this.dsp.outputChannels.length; i++) {
      stateId = this.deviceName + ".outputChannel." + (i + 1) + ".gain";
      this.adapter.setObjectNotExists(stateId, {
        type: "state",
        common: {
          name: "Gain",
          type: "number",
          role: "level.volume",
          read: true,
          write: true,
          min: -72,
          max: 12,
          def: 0,
          unit: "dB"
        },
        native: {}
      });
      this.adapter.subscribeStates(stateId);
      stateId = this.deviceName + ".outputChannel." + (i + 1) + ".mute";
      this.adapter.setObjectNotExists(stateId, {
        type: "state",
        common: {
          name: "Mute",
          type: "boolean",
          role: "switch",
          read: true,
          write: true,
          def: false
        },
        native: {}
      });
      this.adapter.subscribeStates(stateId);
      stateId = this.deviceName + ".outputChannel." + (i + 1) + ".invert";
      this.adapter.setObjectNotExists(stateId, {
        type: "state",
        common: {
          name: "Invert",
          type: "boolean",
          role: "switch",
          read: true,
          write: true,
          def: false
        },
        native: {}
      });
      this.adapter.subscribeStates(stateId);
      stateId = this.deviceName + ".outputChannel." + (i + 1) + ".delay";
      this.adapter.setObjectNotExists(stateId, {
        type: "state",
        common: {
          name: "Delay",
          type: "number",
          role: "switch",
          read: true,
          write: true,
          def: 0,
          min: 0,
          max: 80,
          unit: "ms"
        },
        native: {}
      });
      this.adapter.subscribeStates(stateId);
    }
  }
  stateChanged(id, state) {
    if (!state || (state == null ? void 0 : state.ack))
      return;
    const idSplitted = id.split(".");
    let idx = 0;
    for (let i = 0; i < idSplitted.length; i++) {
      if (idSplitted[i] === this.deviceName) {
        idx = i + 1;
        break;
      }
      if (i == idSplitted.length + 1)
        return;
    }
    switch (idSplitted[idx]) {
      case "masterVolume":
        const vol = utils.cramp((state == null ? void 0 : state.val) - (state == null ? void 0 : state.val) % 0.5, -127.5, 0);
        this.dsp.masterVolume = vol;
        this.adapter.setState(id, vol, true);
        break;
      case "masterMute":
        this.dsp.masterMute = state == null ? void 0 : state.val;
        this.adapter.setState(id, state == null ? void 0 : state.val, true);
        break;
      case "inputSource":
        idx = idx + 1;
        const idSplittedClone = id.split(".");
        for (let i = 0; i < this.dsp.inputSources.length; i++) {
          idSplittedClone[idx] = (i + 1).toString();
          if (parseInt(idSplitted[idx]) == i + 1) {
            this.dsp.inputSources[i].selected = true;
            this.adapter.setState(idSplittedClone.join("."), true, true);
          } else {
            this.adapter.setState(idSplittedClone.join("."), false, true);
          }
        }
        break;
      case "inputChannel":
        const inputIdx = parseInt(idSplitted[idx + 1]) - 1;
        idx = idx + 2;
        switch (idSplitted[idx]) {
          case "gain":
            const gain = utils.cramp(utils.round(state == null ? void 0 : state.val, 1), -72, 12);
            this.dsp.inputChannels[inputIdx].gain = gain;
            this.adapter.setState(id, gain, true);
            break;
          case "mute":
            this.dsp.inputChannels[inputIdx].mute = state == null ? void 0 : state.val;
            this.adapter.setState(id, state == null ? void 0 : state.val, true);
            break;
          default:
            break;
        }
        break;
      case "outputChannel":
        const outputIdx = parseInt(idSplitted[idx + 1]) - 1;
        idx = idx + 2;
        switch (idSplitted[idx]) {
          case "gain":
            const gain = utils.cramp(utils.round(state == null ? void 0 : state.val, 1), -72, 12);
            this.dsp.outputChannels[outputIdx].gain = gain;
            this.adapter.setState(id, gain, true);
            break;
          case "mute":
            this.dsp.outputChannels[outputIdx].mute = state == null ? void 0 : state.val;
            this.adapter.setState(id, state == null ? void 0 : state.val, true);
            break;
          case "invert":
            this.dsp.outputChannels[outputIdx].invert = state == null ? void 0 : state.val;
            this.adapter.setState(id, state == null ? void 0 : state.val, true);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ioBrokerConnector
});
//# sourceMappingURL=ioBrokerConnector.js.map
