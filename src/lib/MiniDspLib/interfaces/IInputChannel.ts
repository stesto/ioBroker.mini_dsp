export interface IInputChannel {
    /* represents the index which the dsp uses.
     * The indices get assigned in this order: inputs -> outputs -> routes
     * For the miniDsp2x4HD there is an offset of 1A:
     * Inputs: 26 - 27 (1A - 1B)
     * Output 28 - 31 (1C - 1F)
     * Routing (handled as channels) 20 - 27
     */
    readonly index: number;

    gain: number;
    mute: boolean;
}
