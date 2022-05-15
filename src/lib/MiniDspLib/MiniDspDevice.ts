import * as hid from "node-hid";
import * as utils from "../utils";
import { InputChannel } from "./InputChannel";
import { InputSource } from "./InputSource";
import { IInputChannel } from "./interfaces/IInputChannel";
import { IInputSource } from "./interfaces/IInputSource";
import { IMiniDspDevice } from "./interfaces/IMiniDspDevice";
import { IOutputChannel } from "./interfaces/IOutputChannel";
import { OutputChannel } from "./OutputChannel";
hid.setDriverType("libusb");

export class MiniDspDevice implements IMiniDspDevice {
    public readonly vendorId: number;
    public readonly productId: number;
    public readonly inputSources: IInputSource[];
    public readonly inputChannels: IInputChannel[];
    public readonly outputChannels: IOutputChannel[];
    private device!: hid.HID;

    constructor(
        vendorId: number,
        productId: number,
        inputSources: string[],
        numberOfInputChannels: number,
        numberOfOutputChannels: number,
    ) {
        this.vendorId = vendorId;
        this.productId = productId;

        this.inputSources = [];
        for (let i = 0; i < inputSources.length; i++) {
            this.inputSources.push(new InputSource(this, i, inputSources[i]));
        }

        // create indices of input channels (e.g. {0, 1} if a device has 2 input channels)
        this.inputChannels = [];
        for (let i = 0; i < numberOfInputChannels; i++) {
            this.inputChannels.push(new InputChannel(this, i));
        }

        // create indices of output channels (e.g. {2, 3, 4, 5} with an offset of the amount of input channels)
        this.outputChannels = [];
        for (let i = this.inputChannels.length; i < numberOfOutputChannels + this.inputChannels.length; i++) {
            this.outputChannels.push(new OutputChannel(this, i));
        }
    }
    connect(): void {
        this.device = new hid.HID(this.vendorId, this.productId);
    }
    close(): void {
        this.device?.close();
    }
    public get masterVolume(): number {
        return 0; //return volume
    }
    public set masterVolume(value: number) {
        this._sendCmd(new Uint8Array([0x42, utils.cramp(value, -127.5, 0) * -2]));
    }

    public get masterMute(): boolean {
        return false; //return mute state
    }
    public set masterMute(value: boolean) {
        this._sendCmd(new Uint8Array([0x17, value ? 1 : 0]));
    }

    _sendCmd(cmd: Uint8Array): void {
        const buff = new Uint8Array(65); // 64 + 1 for feature report id (neccessary in node-hid I guess?)
        buff[1] = cmd.length + 1; // Length-byte containing length of data + 1 byte for checksum at the end
        buff.set(cmd, 2); // insert data
        // calculate checksum
        buff[2 + cmd.length] =
            (cmd.reduce(function (pv: number, cv: number) {
                return pv + cv;
            }) +
                cmd.length +
                1) %
            0x100;
        this.device?.write(Array.from(buff)); // write to miniDSP
    }

    _setChannelGain(index: number, gain: number): void {
        const gainBuff: Uint8Array = new Uint8Array(new Float32Array([utils.cramp(gain, -72.0, 12.0)]).buffer);
        const cmdBuff: Uint8Array = new Uint8Array([
            0x13,
            0x80,
            0x00,
            0x1a /* add offset (see IInputChannel.ts)*/ + index,
        ]);
        const buff: Uint8Array = new Uint8Array(cmdBuff.length + gainBuff.length);

        buff.set(cmdBuff, 0);
        buff.set(gainBuff, cmdBuff.length);

        this._sendCmd(buff);
    }

    _setChannelMute(index: number, value: number): void {
        this._sendCmd(new Uint8Array([0x13, 0x80, 0x00, 0x00 + index, value, 0x00, 0x00, 0x00]));
    }

    setInputSource(input: number | string): void {
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
