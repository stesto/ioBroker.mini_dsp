import { AdapterInstance } from "@iobroker/adapter-core";
import * as utils from "../utils";
import { MiniDspDevice } from "./MiniDspDevice";

export class ioBrokerConnector {
    readonly adapter: AdapterInstance;
    readonly dsp: MiniDspDevice;
    readonly deviceName: string;

    constructor(adapter: AdapterInstance, dsp: MiniDspDevice, deviceName: string) {
        this.adapter = adapter;
        this.dsp = dsp;
        this.deviceName = deviceName;
    }

    PopulateAndSubscribeStates(): void {
        let stateId: string;

        // Master Volume
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
                max: 0.0,
                def: 0.0,
                unit: "dB",
            },
            native: {},
        });
        this.adapter.subscribeStates(stateId);

        // Master Mute
        stateId = this.deviceName + ".masterMute";
        this.adapter.setObjectNotExists(stateId, {
            type: "state",
            common: {
                name: "Master Mute",
                type: "boolean",
                role: "switch",
                read: true,
                write: true,
                def: false,
            },
            native: {},
        });
        this.adapter.subscribeStates(stateId);

        // Input Sources
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
                    def: i == 0 ? true : false,
                },
                native: {},
            });
            this.adapter.subscribeStates(stateId);
        }

        // Input Channels
        for (let i = 0; i < this.dsp.inputChannels.length; i++) {
            // gain
            stateId = this.deviceName + ".inputChannel." + (i + 1) + ".gain";
            this.adapter.setObjectNotExists(stateId, {
                type: "state",
                common: {
                    name: "Gain",
                    type: "number",
                    role: "level.volume",
                    read: true,
                    write: true,
                    min: -72.0,
                    max: 12.0,
                    def: 0.0,
                    unit: "dB",
                },
                native: {},
            });
            this.adapter.subscribeStates(stateId);
            // mute
            stateId = this.deviceName + ".inputChannel." + (i + 1) + ".mute";
            this.adapter.setObjectNotExists(stateId, {
                type: "state",
                common: {
                    name: "Mute",
                    type: "boolean",
                    role: "switch",
                    read: true,
                    write: true,
                    def: false,
                },
                native: {},
            });
            this.adapter.subscribeStates(stateId);
        }

        // Output Channels
        for (let i = 0; i < this.dsp.outputChannels.length; i++) {
            // gain
            stateId = this.deviceName + ".outputChannel." + (i + 1) + ".gain";
            this.adapter.setObjectNotExists(stateId, {
                type: "state",
                common: {
                    name: "Gain",
                    type: "number",
                    role: "level.volume",
                    read: true,
                    write: true,
                    min: -72.0,
                    max: 12.0,
                    def: 0.0,
                    unit: "dB",
                },
                native: {},
            });
            this.adapter.subscribeStates(stateId);
            // mute
            stateId = this.deviceName + ".outputChannel." + (i + 1) + ".mute";
            this.adapter.setObjectNotExists(stateId, {
                type: "state",
                common: {
                    name: "Mute",
                    type: "boolean",
                    role: "switch",
                    read: true,
                    write: true,
                    def: false,
                },
                native: {},
            });
            this.adapter.subscribeStates(stateId);
            // invert
            stateId = this.deviceName + ".outputChannel." + (i + 1) + ".invert";
            this.adapter.setObjectNotExists(stateId, {
                type: "state",
                common: {
                    name: "Invert",
                    type: "boolean",
                    role: "switch",
                    read: true,
                    write: true,
                    def: false,
                },
                native: {},
            });
            this.adapter.subscribeStates(stateId);
            // delay
            stateId = this.deviceName + ".outputChannel." + (i + 1) + ".delay";
            this.adapter.setObjectNotExists(stateId, {
                type: "state",
                common: {
                    name: "Delay",
                    type: "number",
                    role: "switch",
                    read: true,
                    write: true,
                    def: 0.0,
                    min: 0.0,
                    max: 80.0,
                    unit: "ms",
                },
                native: {},
            });
            this.adapter.subscribeStates(stateId);
        }
    }

    stateChanged(id: string, state: ioBroker.State | null | undefined): void {
        if (!state || state?.ack) return;

        const idSplitted = id.split(".");
        let idx = 0;

        for (let i = 0; i < idSplitted.length; i++) {
            if (idSplitted[i] === this.deviceName) {
                idx = i + 1; // + 1 to skip the this.deviceName
                break;
            }
            //return if this.deviceName is not in the state id
            if (i == idSplitted.length + 1) return;
        }

        switch (idSplitted[idx]) {
            case "masterVolume":
                const vol = utils.cramp(<number>state?.val - (<number>state?.val % 0.5), -127.5, 0);
                this.dsp.masterVolume = vol;
                this.adapter.setState(id, vol, true);
                break;
            case "masterMute":
                this.dsp.masterMute = <boolean>state?.val;
                this.adapter.setState(id, <boolean>state?.val, true);
                break;
            case "inputSource":
                idx = idx + 1;
                const idSplittedClone = id.split(".");
                for (let i = 0; i < this.dsp.inputSources.length; i++) {
                    idSplittedClone[idx] = (i + 1).toString();
                    // select input and set every other to false
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
                        const gain = utils.cramp(utils.round(<number>state?.val, 1), -72.0, 12.0);
                        this.dsp.inputChannels[inputIdx].gain = gain;
                        this.adapter.setState(id, gain, true);
                        break;
                    case "mute":
                        this.dsp.inputChannels[inputIdx].mute = <boolean>state?.val;
                        this.adapter.setState(id, <boolean>state?.val, true);
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
                        const gain = utils.cramp(utils.round(<number>state?.val, 1), -72.0, 12.0);
                        this.dsp.outputChannels[outputIdx].gain = gain;
                        this.adapter.setState(id, gain, true);
                        break;
                    case "mute":
                        this.dsp.outputChannels[outputIdx].mute = <boolean>state?.val;
                        this.adapter.setState(id, <boolean>state?.val, true);
                        break;
                    case "invert":
                        this.dsp.outputChannels[outputIdx].invert = <boolean>state?.val;
                        this.adapter.setState(id, <boolean>state?.val, true);
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
