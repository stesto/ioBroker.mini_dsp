import { AdapterInstance } from "@iobroker/adapter-core";
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
        stateId = this.deviceName + ".MasterVolume";
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
        stateId = this.deviceName + ".MasterMute";
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
            stateId = this.deviceName + ".InputSource." + i;
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
            stateId = this.deviceName + ".InputChannel." + i;
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
            // mute
            stateId = this.deviceName + ".InputSource." + i;
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
    }

    stateChanged(id: string, state: ioBroker.State | null | undefined): void {
        id = id;
        state?.ack;
    }
}
