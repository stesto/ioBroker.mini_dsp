import * as utils from "../../lib/utils";
import { IInputChannel } from "./interfaces/IInputChannel";
import { IMiniDspDevice } from "./interfaces/IMiniDspDevice";
import { MiniDspDevice } from "./MiniDspDevice";

export class InputChannel implements IInputChannel {
    readonly miniDspDevice: IMiniDspDevice;

    readonly index: number;

    constructor(miniDspDevice: IMiniDspDevice, index: number) {
        this.miniDspDevice = miniDspDevice;
        this.index = index;
    }

    public get gain(): number {
        return 0;
    }
    public set gain(value: number) {
        (<MiniDspDevice>this.miniDspDevice)._setChannelGain(this.index, utils.cramp(value, -72.0, 12.0));
    }

    public get mute(): boolean {
        return false;
    }
    public set mute(value: boolean) {
        (<MiniDspDevice>this.miniDspDevice)._setChannelMute(this.index, value ? 0x01 : 0x02);
    }
}
