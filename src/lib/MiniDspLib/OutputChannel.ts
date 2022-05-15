import { InputChannel } from "./InputChannel";
import { IMiniDspDevice } from "./interfaces/IMiniDspDevice";
import { IOutputChannel } from "./interfaces/IOutputChannel";
import { MiniDspDevice } from "./MiniDspDevice";

export class OutputChannel extends InputChannel implements IOutputChannel {
    constructor(miniDspDevice: IMiniDspDevice, index: number) {
        super(miniDspDevice, index);
    }

    public get invert(): boolean {
        return false; // return if phase is inverted
    }
    public set invert(value: boolean) {
        (<MiniDspDevice>this.miniDspDevice)._setChannelMute(
            this.index - this.miniDspDevice.inputChannels.length + 0x50,
            value ? 0x01 : 0x00,
        );
    }

    public get delay(): number {
        return 0;
    }
    public set delay(value: number) {
        //set delay
    }
}
