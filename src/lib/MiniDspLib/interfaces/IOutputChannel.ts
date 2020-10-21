import { IInputChannel } from "iobroker.mini_dsp/src/lib/MiniDspLib/interfaces/IInputChannel";

export interface IOutputChannel extends IInputChannel {
    invert: boolean;
    delay: number;
}
