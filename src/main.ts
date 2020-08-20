/*
 * Created with @iobroker/create-adapter v1.26.0
 */

// TODO: Find better way to debug
// to debug: node --inspect-brk build/main.js --force --logs

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from "@iobroker/adapter-core";
import * as hid from "node-hid";
hid.setDriverType("libusb");

// Load your modules here, e.g.:
// import * as fs from "fs";

// Augment the adapter.config object with the actual types
// TODO: delete this in the next version
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace ioBroker {
        interface AdapterConfig {
            // Define the shape of your options here (recommended)
            option1: boolean;
            option2: string;
            // Or use a catch-all approach
            [key: string]: any;
        }
    }
}

class MiniDsp extends utils.Adapter {
    dsp: hid.HID | undefined;

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: "mini_dsp",
        });
        this.on("ready", this.onReady.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        // this.on("objectChange", this.onObjectChange.bind(this));
        // this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        // Initialize your adapter here
        this.setState("info.connection", false, true);
        this.createDspStates();
        this.connectToDsp();
        // Reset the connection indicator during startup

        // The adapters config (in the instance object everything under the attribute "native") is accessible via
        // this.config:
        // this.log.info("config option1: " + this.config.option1);
        // this.log.info("config option2: " + this.config.option2);

        /*
		For every state in the system there has to be also an object of type state
		Here a simple template for a boolean variable named "testVariable"
		Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
		*/
        // await this.setObjectNotExistsAsync("masterMute", {
        //     type: "state",
        //     common: {
        //         name: "masterMute",
        //         type: "boolean",
        //         role: "indicator",
        //         read: true,
        //         write: true,
        //     },
        //     native: {},
        // });

        // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
        // You can also add a subscription for multiple states. The following line watches all states starting with "lights."
        // this.subscribeStates("lights.*");
        // Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
        // this.subscribeStates("*");

        /*
			setState examples
			you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
		*/
        // the variable testVariable is set to true as command (ack=false)
        // await this.setStateAsync("testVariable", true);

        // same thing, but the value is flagged "ack"
        // ack should be always set to true if the value is received from or acknowledged from the target system
        // await this.setStateAsync("testVariable", { val: true, ack: true });

        // same thing, but the state is deleted after 30s (getState will return null afterwards)
        // await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });

        // examples for the checkPassword/checkGroup functions
        // let result = await this.checkPasswordAsync("admin", "iobroker");
        // this.log.info("check user admin pw iobroker: " + result);

        // result = await this.checkGroupAsync("admin", "admin");
        // this.log.info("check group user admin group admin: " + result);
    }

    private connectToDsp(): void {
        try {
            this.dsp = new hid.HID(0x2752, 0x0011);
            this.log.info("Connected with miniDsp");
            this.setState("info.connection", true, true);
        } catch (e) {
            this.log.error("Can't connect with miniDsp");
            this.log.error(e);
        }
    }

    private async createDspStates(): Promise<void> {
        const base = "miniDsp2x4HD.";
        await this.setObjectNotExistsAsync(base + "MasterMute", {
            type: "state",
            common: {
                name: "MasterMute",
                type: "boolean",
                role: "switch",
                read: true,
                write: true,
                def: false,
            },
            native: {},
        });
        this.subscribeStates("miniDsp2x4HD.MasterMute");
        await this.setObjectNotExistsAsync(base + "MasterVolume", {
            type: "state",
            common: {
                name: "MasterVolume",
                type: "number",
                role: "level.volume",
                read: true,
                write: true,
                min: 0,
                max: 100,
                unit: "%",
                def: 100,
            },
            native: {},
        });
        this.subscribeStates("miniDsp2x4HD.MasterVolume");
        await this.setObjectNotExistsAsync(base + "MinimumVolume", {
            type: "state",
            common: {
                name: "MinimumVolume",
                type: "number",
                role: "level",
                read: true,
                write: true,
                max: 0,
                min: -127.5,
                unit: "db",
                def: 0,
            },
            native: {},
        });
        this.subscribeStates("miniDsp2x4HD.MinimumVolume");
        await this.setObjectNotExistsAsync(base + "DropToZeroBelow", {
            type: "state",
            common: {
                name: "DropToZeroBelow",
                type: "number",
                role: "level.volume",
                read: true,
                write: true,
                min: 0,
                max: 100,
                unit: "%",
            },
            native: {},
        });
        this.subscribeStates("miniDsp2x4HD.DropToZeroBelow");

        // Inputs
        await this.setObjectNotExistsAsync(base + "InputSource.Analog", {
            type: "state",
            common: {
                name: "Analog",
                type: "boolean",
                role: "switch",
                read: true,
                write: true,
                def: false,
            },
            native: {},
        });
        this.subscribeStates("miniDsp2x4HD.InputSource.Analog");
        await this.setObjectNotExistsAsync(base + "InputSource.Toslink", {
            type: "state",
            common: {
                name: "Toslink",
                type: "boolean",
                role: "switch",
                read: true,
                write: true,
                def: false,
            },
            native: {},
        });
        this.subscribeStates("miniDsp2x4HD.InputSource.Toslink");
        await this.setObjectNotExistsAsync(base + "InputSource.USB", {
            type: "state",
            common: {
                name: "USB",
                type: "boolean",
                role: "switch",
                read: true,
                write: true,
                def: false,
            },
            native: {},
        });
        this.subscribeStates("miniDsp2x4HD.InputSource.USB");
    }

    private dspCmd(data: Uint8Array): void {
        const buff = new Uint8Array(65); // 64 + 1 for feature report id (neccessary in node-hid I guess?)
        buff[1] = data.length + 1; // Length-byte containing length of data + 1 byte for checksum at the end
        buff.set(data, 2); // insert data
        // calculate checksum
        buff[2 + data.length] =
            (data.reduce(function (pv: number, cv: number) {
                return pv + cv;
            }) +
                data.length +
                1) %
            0x100;
        this.dsp?.write(Array.from(buff)); // write to miniDSP
    }

    /**
     * limits a value to a given range
     * @param value the value which should be in a range
     * @param min the lowest possible value
     * @param max the highest possible value
     */
    private limit(value: number, min: number, max: number): number {
        if (value <= min) {
            return min;
        }
        if (value >= max) {
            return max;
        }
        return value;
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
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

    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  */
    // private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
    //     if (obj) {
    //         // The object was changed
    //         this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    //     } else {
    //         // The object was deleted
    //         this.log.info(`object ${id} deleted`);
    //     }
    // }

    /**
     * Is called if a subscribed state changes
     */
    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  */
    // private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
    //     if (obj) {
    //         // The object was changed
    //         this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    //     } else {
    //         // The object was deleted
    //         this.log.info(`object ${id} deleted`);
    //     }
    // }
    /**
     * Is called if a subscribed state changes
     */
    DropToZeroBelow = 0;
    MinimumVolume = 255;
    private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
        if (state && state.ack == false) {
            // The state was changed
            if (id.includes("miniDsp2x4HD.MasterMute")) {
                if (state.val == true) {
                    this.dspCmd(new Uint8Array([0x17, 0x01]));
                } else {
                    this.dspCmd(new Uint8Array([0x17, 0x00]));
                }
            }
            if (id.includes("miniDsp2x4HD.MasterVolume")) {
                if ((state.val as number) >= 0 && (state.val as number) <= 100) {
                    let newVol = 0;
                    const vol = this.limit(state.val as number, 0, 100);
                    if (vol > this.DropToZeroBelow) {
                        newVol = vol * (-this.MinimumVolume / 100) + this.MinimumVolume;
                    } else {
                        newVol =
                            ((255 - (this.DropToZeroBelow * (-this.MinimumVolume / 100) + this.MinimumVolume)) /
                                (0 - this.DropToZeroBelow)) *
                                vol +
                            255;
                    }
                    this.dspCmd(new Uint8Array([0x42, newVol]));
                }
            }
            if (id.includes("miniDsp2x4HD.MinimumVolume")) {
                this.MinimumVolume = Math.round(this.limit(state.val as number, -127.5, 0) * -2);
            }
            if (id.includes("miniDsp2x4HD.DropToZeroBelow")) {
                this.DropToZeroBelow = this.limit(state.val as number, 0, 100);
            }
            if (id.includes("InputSource.Analog")) {
                this.dspCmd(new Uint8Array([0x34, 0x00]));
                this.setState("mini_dsp.0.miniDsp2x4HD.InputSource.Analog", true, true);
                this.setState("mini_dsp.0.miniDsp2x4HD.InputSource.Toslink", false, true);
                this.setState("mini_dsp.0.miniDsp2x4HD.InputSource.USB", false, true);
                return;
            }
            if (id.includes("InputSource.Toslink")) {
                this.dspCmd(new Uint8Array([0x34, 0x01]));
                this.setState("mini_dsp.0.miniDsp2x4HD.InputSource.Analog", false, true);
                this.setState("mini_dsp.0.miniDsp2x4HD.InputSource.Toslink", true, true);
                this.setState("mini_dsp.0.miniDsp2x4HD.InputSource.USB", false, true);
                return;
            }
            if (id.includes("InputSource.USB")) {
                this.dspCmd(new Uint8Array([0x34, 0x02]));
                this.setState("mini_dsp.0.miniDsp2x4HD.InputSource.Analog", false, true);
                this.setState("mini_dsp.0.miniDsp2x4HD.InputSource.Toslink", false, true);
                this.setState("mini_dsp.0.miniDsp2x4HD.InputSource.USB", false, true);
                return;
            }
            this.setState(id, state, true);
        }
    }

    // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires "common.message" property to be set to true in io-package.json
    //  */
    // private onMessage(obj: ioBroker.Message): void {
    //     if (typeof obj === "object" && obj.message) {
    //         if (obj.command === "send") {
    //             // e.g. send email or pushover or whatever
    //             this.log.info("send command");

    //             // Send response in callback if required
    //             if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
    //         }
    //     }
    // }
}

if (module.parent) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new MiniDsp(options);
} else {
    // otherwise start the instance directly
    (() => new MiniDsp())();
}
