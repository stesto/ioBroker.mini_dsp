import { IInputChannel } from "./IInputChannel";
import { IInputSource } from "./IInputSource";
import { IOutputChannel } from "./IOutputChannel";

export interface IMiniDspDevice {
    readonly vendorId: number;
    readonly productId: number;

    readonly inputSources: IInputSource[];

    readonly inputChannels: IInputChannel[];
    readonly outputChannels: IOutputChannel[];

    connect(): void;
    close(): void;

    _sendCmd(cmd: Uint8Array): void;

    masterVolume: number;
    masterMute: boolean;
}
