import { IInputSource } from "./interfaces/IInputSource";
import { IMiniDspDevice } from "./interfaces/IMiniDspDevice";

export class InputSource implements IInputSource {
    readonly miniDspDevice: IMiniDspDevice;

    readonly index: number;
    readonly name: string;

    constructor(miniDspDevice: IMiniDspDevice, index: number, name: string) {
        this.miniDspDevice = miniDspDevice;
        this.index = index;
        this.name = name;
    }

    public get selected(): boolean {
        return false;
    }
    public set selected(value: boolean) {
        if (value) {
            this.miniDspDevice._sendCmd(new Uint8Array([0x34, this.index]));
        }
    }
}
