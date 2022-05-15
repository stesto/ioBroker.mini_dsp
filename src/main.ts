/*
 * Created with @iobroker/create-adapter v2.1.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from "@iobroker/adapter-core";
import { ioBrokerConnector } from "./lib/MiniDspLib/ioBrokerConnector";
import { MiniDspDevice } from "./lib/MiniDspLib/MiniDspDevice";

// Load your modules here, e.g.:
// import * as fs from "fs";

class MiniDsp extends utils.Adapter {
    dsp!: MiniDspDevice;
    dspConnector!: ioBrokerConnector;

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: "mini_dsp",
        });
        this.on("ready", this.onReady.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        this.on("unload", this.onUnload.bind(this));
    }

    private async onReady(): Promise<void> {
        this.setState("info.connection", false, true);
        this.dsp = new MiniDspDevice(0x2752, 0x0011, ["Analog", "Toslink", "USB"], 2, 4);
        this.dsp.connect();

        this.dspConnector = new ioBrokerConnector(this, this.dsp, "miniDsp2x4HD");
        this.dspConnector.PopulateAndSubscribeStates();

        this.setState("info.connection", true, true);
    }

    private onUnload(callback: () => void): void {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            // clearTimeout(timeout1);
            // clearTimeout(timeout2);
            // ...
            // clearInterval(interval1);
            this.dsp?.close();
            callback();
        } catch (e) {
            callback();
        }
    }

    private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
        this.dspConnector.stateChanged(id, state);
    }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new MiniDsp(options);
} else {
    // otherwise start the instance directly
    (() => new MiniDsp())();
}
