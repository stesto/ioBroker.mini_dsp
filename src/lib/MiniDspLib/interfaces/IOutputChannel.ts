import { IInputChannel } from "./IInputChannel";

export interface IOutputChannel extends IInputChannel {
    invert: boolean;
    delay: number;
}
